import { Request, Response } from "express";
import catchAsyncFn from "../../utils/catchAsyncFn";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const login = catchAsyncFn(async (req: Request, res: Response) => {
    
  const user = await authService.login(req.body.email, req.body.password);
  sendResponse(res, {
    success: true,
    message: "User logged in successfully",
    statusCode: httpStatus.OK,
    data: user,
  });
});

export const authController = { login };
