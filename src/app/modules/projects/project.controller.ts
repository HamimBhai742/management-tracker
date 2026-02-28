import { Request, Response } from "express";
import catchAsyncFn from "../../utils/catchAsyncFn";
import { projectService } from "./project.service";
import { IJwtPayload } from "../../interface/user.interface";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createProject = catchAsyncFn(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const { userId } = req.user as IJwtPayload;
    const project = await projectService.createNewProject(req.body, userId);

    sendResponse(res, {
      success: true,
      message: "Project created successfully",
      statusCode: httpStatus.CREATED,
      data: project,
    });
  },
);

const getAllProjects = catchAsyncFn(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const { userId } = req.user as IJwtPayload;
    const projects = await projectService.getAllProjects(userId);

    sendResponse(res, {
      success: true,
      message: "Projects fetched successfully",
      statusCode: httpStatus.OK,
      data: projects,
    });
  },
);

const updateProject = catchAsyncFn(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const { userId } = req.user as IJwtPayload;
    const project = await projectService.updateProject(
      req.params.id as string,
      userId,
      req.body,
    );

    sendResponse(res, {
      success: true,
      message: "Project updated successfully",
      statusCode: httpStatus.OK,
      data: project,
    });
  },
);

export const projectController = { createProject, getAllProjects, updateProject };
