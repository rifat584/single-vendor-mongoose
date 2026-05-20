import mongoose from "mongoose";
import { ROLES } from "../../../utils/enum.js";

const { model, models, Schema } = mongoose;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
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
  },
);

const verificationCodeSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
);

// Find User Static Method
userSchema.statics.findUserByEmail = function (email) {
  return this.findOne({ email }).lean();
};

export const User = models.User || model("User", userSchema);

export const VerificationCode =
  models.VerificationCode || model("VerificationCode", verificationCodeSchema);
