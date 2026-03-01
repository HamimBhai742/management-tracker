import { Request, Response } from "express";
import catchAsyncFn from "../../utils/catchAsyncFn";
import { AdminService } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const getStats = catchAsyncFn(async (req: Request, res: Response) => {
  const stats = await AdminService.getStats();

  sendResponse(res, {
    success: true,
    message: "Stats fetched successfully",
    statusCode: httpStatus.OK,
    data: stats,
  });
});

export const adminController = { getStats };
