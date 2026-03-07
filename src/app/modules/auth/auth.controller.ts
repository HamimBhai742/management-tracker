import { Request, Response } from "express";
import catchAsyncFn from "../../utils/catchAsyncFn";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { IJwtPayload } from "../../interface/user.interface";

const login = catchAsyncFn(async (req: Request, res: Response) => {
  const user = await authService.login(req.body.email, req.body.password);
  sendResponse(res, {
    success: true,
    message: "User logged in successfully",
    statusCode: httpStatus.OK,
    data: user,
  });
});

const changePassword = catchAsyncFn(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const { email } = req.user as IJwtPayload;
    const user = await authService.changePassword(
      email,
      req.body.oldPassword,
      req.body.newPassword,
    );

    sendResponse(res, {
      success: true,
      message: "Password changed successfully",
      statusCode: httpStatus.OK,
      data: user,
    });
  },
);

const authMe = catchAsyncFn(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const { email } = req.user as IJwtPayload;
    const user = await authService.authMe(email);
    sendResponse(res, {
      success: true,
      message: "User retrieved successfully",
      statusCode: httpStatus.OK,
      data: user,
    });
  },
);

export const authController = { login, changePassword, authMe };
