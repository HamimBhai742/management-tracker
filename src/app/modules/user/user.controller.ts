import { Request, Response } from "express";
import catchAsyncFn from "../../utils/catchAsyncFn";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const registerUser = catchAsyncFn(async (req: Request, res: Response) => {
  const user = await userService.registerUser(req.body);

  sendResponse(res, {
    success: true,
    message: "User created successfully",
    statusCode: httpStatus.CREATED,
    data: user,
  });
});

export const userController = { registerUser };
