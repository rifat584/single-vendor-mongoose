import mongoose from "mongoose";

export const isValidObjectId = (value: string) =>
  mongoose.Types.ObjectId.isValid(value);

export const toObjectId = (value: string) =>
  new mongoose.Types.ObjectId(value);
