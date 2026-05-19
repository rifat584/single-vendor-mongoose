// Handles ->business logic, DB logic, data processing, returning result to controller
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import mongoose from "mongoose";
import {
  loginSchemaType,
  registerSchemaType,
  verifyEmailSchemaType,
} from "./auth.validation";
import { sendVerificationEmail } from "../../../lib/sendEmail.js";
import { User, VerificationCode } from "./auth.model.js";

// Login Logic
const login = async (payload: loginSchemaType) => {
  const { email, password } = payload;

  const user = await User.findOne({ email }).lean();

  // Throw Error if user doesn't exist/unverified email
  if (!user) {
    const err = new Error("Invalid Email or Password!");
    throw err;
  } else if (!user.isEmailVerified) {
    const err = new Error("Please verify your email address!");
    throw err;
  }

  // Match user's password against our DB
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    const err = new Error("Invalid Email or Password!");
    throw err;
  }

  return { id: user._id, email: user.email, name: user.name };
};

// Register Logic
const register = async (payload: registerSchemaType) => {
  const { name, email, password, role } = payload;

  // Find user
  const findUser = await User.findOne({ email }).lean();

  // If user already exist
  if (findUser) {
    const err = new Error("User Already Exits!");
    throw err;
  }

  const hashedPassword: string = await bcrypt.hash(password, 10); //pass hashing
  const verificationCode = crypto.randomInt(100000, 1000000).toString(); //generate verification code
  const expirationTime = 24 * 60 * 60 * 1000; //24 Hour
  const expiresAtDate = new Date(Date.now() + expirationTime); //+24h

  // insert user and verification code to DB
  const session = await mongoose.startSession();

  let result: {
    user: Awaited<ReturnType<typeof User.create>>[number];
    emailVerificationCode: Awaited<ReturnType<typeof VerificationCode.create>>[number];
  };

  try {
    session.startTransaction();

    const [user] = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
          role,
        },
      ],
      { session },
    );

    const [emailVerificationCode] = await VerificationCode.create(
      [
        {
          userId: user._id,
          code: verificationCode,
          expiresAt: expiresAtDate,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    result = { user, emailVerificationCode };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  // Send verification code to email
  sendVerificationEmail(result.user.email, verificationCode).catch((error) => {
    console.error("Failed to send verification email:", error);
  });

  return result;
};

// Email Verification Logic
const verifyEmail = async (payload: verifyEmailSchemaType) => {
  const { email, code } = payload;

  // Find the user
  const user = await User.findOne({ email }).lean();

  // if user doesn't exist in DB
  if (!user) {
    const err = new Error("User not found!");
    throw err;
  }

  // find the verification code
  const validate = await VerificationCode.findOne({
    userId: user._id,
    code,
  })
    .select("_id isUsed expiresAt")
    .sort({ createdAt: -1 })
    .lean();

  // check if there's any verification code
  if (!validate) {
    const err = new Error("No verification code found!");
    throw err;
  }
  // check if the code is used
  if (validate.isUsed) {
    const err = new Error("Invalid Code! This code has already been used.");
    throw err;
  }
  // verify expires date
  if (new Date() > validate.expiresAt) {
    const err = new Error("Verification Code Expired!");
    throw err;
  }

  // Update email verification and code use status
  const session = await mongoose.startSession();

  let result: {
    updateEmailVerificationStatus: Awaited<ReturnType<typeof User.findByIdAndUpdate>>;
    updateIsCodeUsed: Awaited<ReturnType<typeof VerificationCode.findByIdAndUpdate>>;
  };

  try {
    session.startTransaction();

    const updateEmailVerificationStatus = await User.findByIdAndUpdate(
      user._id,
      {
        isEmailVerified: true,
      },
      { returnDocument: "after", session },
    );

    const updateIsCodeUsed = await VerificationCode.findByIdAndUpdate(
      validate._id,
      {
        isUsed: true,
      },
      { returnDocument: "after", session },
    );

    await session.commitTransaction();
    result = { updateEmailVerificationStatus, updateIsCodeUsed };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  return result;
};

const changePassword = async (payload: object) => {
  return payload;
};

const forgotPassword = async (payload: string) => {
  return payload;
};

export const AuthService = {
  login,
  register,
  verifyEmail,
  changePassword,
  forgotPassword,
};
