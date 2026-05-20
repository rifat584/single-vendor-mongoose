import { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import sendResponse from "../../../utils/ApiResponse.js";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";

// Handles-> Req, Res, Service Call

// Handle user Login
const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login Successful",
    data: result,
  });
});

// Handle User Registration
const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);
  const { id, name, email, isEmailVerified, createdAt } = result.user;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Register successful",
    data: { id, name, email, isEmailVerified, createdAt },
  });
});

// Handle Verify Email
const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.verifyEmail(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Email Verification successful",
  });
});

const changePassword = async (req: Request, res: Response) => {
  const result = await AuthService.changePassword({
    oldPassword: "old",
    newPassword: "new",
    confirmNewPassword: "confirmed",
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password Changed Successfully",
    data: result,
  });
};

const forgotPassword = async (req: Request, res: Response) => {
  const result = await AuthService.forgotPassword("myemail@gmail.com");
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset mail sent!",
    data: result,
  });
};


// Multer
const multer = catchAsync(async (req:Request, res:Response) => {
  const file = req.file;

  const result = await AuthService.multer(file);

  res.status(200).json({
    success: true,
    data: result,
  });
});




export const AuthController = {
  login,
  register,
  verifyEmail,
  changePassword,
  forgotPassword,
  multer,
};
