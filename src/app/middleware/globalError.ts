import { NextFunction, Request, Response } from "express";
import env from "../../config/env.js";
import { errResponse } from "../../types/response.js";
import status from "http-status";

const globalError = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong!";

  const errResponse: errResponse = {
    success: false,
    message,
  };

  if (env.NODE_ENV === "development") {
    errResponse.stack = err.stack;
    errResponse.error = err;
  }

  res.status(statusCode).json(errResponse);
};

export default globalError;
