import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { isValidObjectId } from "../../utils/objectId.js";

const validateObjectIdParam = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = req.params[paramName];

    if (typeof value !== "string" || !isValidObjectId(value)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: `Invalid ${paramName}`,
      });
    }

    next();
  };
};

export default validateObjectIdParam;
