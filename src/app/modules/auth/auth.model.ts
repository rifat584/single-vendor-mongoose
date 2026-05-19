import mongoose from "mongoose";
import { ROLES } from "../../../utils/enum.js";

const { model, models, Schema } = mongoose;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ROLES,
      default: "CUSTOMER",
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);


const verificationCodeSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  code: {
    type: String,
    required: true,
  },

  isUsed: {
    type: Boolean,
    default: false,
  },

  expiresAt: {
    type: Date,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User =
  models.User || model("User", userSchema);

export const VerificationCode =
  models.VerificationCode ||
  model("VerificationCode", verificationCodeSchema);
