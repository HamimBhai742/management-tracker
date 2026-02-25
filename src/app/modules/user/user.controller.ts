import { Request, Response } from "express";
import catchAsyncFn from "../../utils/catchAsyncFn";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

//register new user
const registerUser = catchAsyncFn(async (req: Request, res: Response) => {
  const user = await userService.registerUser(req.body);

  sendResponse(res, {
    success: true,
    message: "User created successfully",
    statusCode: httpStatus.CREATED,
    data: user,
  });
});

//otp VERIFY
const otpVerify = catchAsyncFn(async (req: Request, res: Response) => {
  const user = await userService.otpVerify(req.body.email, req.body.otp);
  sendResponse(res, {
    success: true,
    message: "User verified successfully",
    statusCode: httpStatus.OK,
    data: null,
  });
});

//resend otp
const resendOtp = catchAsyncFn(async (req: Request, res: Response) => {
  const user = await userService.resendOtp(req.body.email);

  sendResponse(res, {
    success: true,
    message: "Otp sent successfully",
    statusCode: httpStatus.OK,
    data: user,
  });
});

//forget password
const forgetPassword = catchAsyncFn(async (req: Request, res: Response) => {
  const user = await userService.forgetPassword(req.body.email);
  sendResponse(res, {
    success: true,
    message: "Otp sent successfully",
    statusCode: httpStatus.OK,
    data: user,
  });
});

export const userController = {
  registerUser,
  otpVerify,
  resendOtp,
  forgetPassword,
};
