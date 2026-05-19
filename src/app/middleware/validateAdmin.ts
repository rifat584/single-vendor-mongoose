import { NextFunction, Request, Response } from "express";
import { User } from "../modules/auth/auth.model.js";

const validateAdmin = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      throw new Error("User id is required!");
    }

    const isAdmin = await User.findOne({
      _id: userId,
      role: "ADMIN",
    }).lean();

    if (!isAdmin) {
      throw new Error("User is not valid");
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default validateAdmin;
