import { Request, Response } from "express";
import catchAsyncFn from "../../utils/catchAsyncFn";
import { projectService } from "./project.service";
import { IJwtPayload } from "../../interface/user.interface";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { excludeFiled } from "./projects.constain";

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
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "desc";
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const filter = req.query || "";

    for (const f of excludeFiled) {
      delete filter[f];
    }
    
    const projects = await projectService.getAllProjects(
      userId,
      filter,
      page,
      limit,
      search as string,
      sortBy as string,
      sortOrder as "asc" | "desc",
    );

    sendResponse(res, {
      success: true,
      message: "Projects fetched successfully",
      statusCode: httpStatus.OK,
      data: projects,
    });
  },
);

const getSingleProject = catchAsyncFn(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const project = await projectService.getSingleProject(
      req.params.id as string,
      req?.user?.userId as string,
    );
    sendResponse(res, {
      success: true,
      message: "Project fetched successfully",
      statusCode: httpStatus.OK,
      data: project,
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

const deleteProject = catchAsyncFn(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    await projectService.deleteProject(
      req.params.id as string,
      req?.user?.userId as string,
    );

    sendResponse(res, {
      success: true,
      message: "Project deleted successfully",
      statusCode: httpStatus.OK,
      data: null,
    });
  },
);

const stats = catchAsyncFn(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const stats = await projectService.stats(req?.user?.userId as string);
    sendResponse(res, {
      success: true,
      message: "Stats fetched successfully",
      statusCode: httpStatus.OK,
      data: stats,
    });
  },
);

export const projectController = {
  createProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  deleteProject,
  stats,
};
