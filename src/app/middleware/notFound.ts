import { Request, Response } from "express";
import httpStatus from "http-status";

const notFound = async (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Api not found",
    error: {
      path: req.originalUrl, //find the requested url
      message: "Your requested path was not found",
    },
  });
};

export default notFound;
