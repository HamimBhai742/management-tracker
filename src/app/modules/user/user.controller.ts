import { Request, Response } from "express";
import catchAsyncFn from "../../utils/catchAsyncFn";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { IJwtPayload } from "../../interface/user.interface";

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
    message: "Reset link sent successfully",
    statusCode: httpStatus.OK,
    data: user,
  });
});

//get all users
const getAllUsers = catchAsyncFn(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  sendResponse(res, {
    success: true,
    message: "Users fetched successfully",
    statusCode: httpStatus.OK,
    data: users,
  });
});

//update user
const updateUser = catchAsyncFn(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const { userId } = req.user as IJwtPayload;
    const user = await userService.updateUser(userId, req.body);
    sendResponse(res, {
      success: true,
      message: "User updated successfully",
      statusCode: httpStatus.OK,
      data: user,
    });
  },
);

const resetPassword = catchAsyncFn(async (req: Request, res: Response) => {
  const user = await userService.resetPassword(
    req.query.token as string,
    req.body.password,
  );
  sendResponse(res, {
    success: true,
    message: "User password reset successfully",
    statusCode: httpStatus.OK,
    data: user,
  });
});

const getMyStats = catchAsyncFn(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const { userId } = req.user as IJwtPayload;
    const user = await userService.getMyStats(userId);
    sendResponse(res, {
      success: true,
      message: "User stats fetched successfully",
      statusCode: httpStatus.OK,
      data: user,
    });
  },
);

export const userController = {
  registerUser,
  otpVerify,
  resendOtp,
  forgetPassword,
  getAllUsers,
  updateUser,
  resetPassword,
  getMyStats,
};
