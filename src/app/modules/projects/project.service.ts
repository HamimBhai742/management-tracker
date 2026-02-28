import { Prisma } from "../../../generated/prisma/client";
import { AppError } from "../../error";
import { prisma } from "../../utils/prisma";
import httpStatus from "http-status";

const createNewProject = async (
  payload: Prisma.ProjectCreateInput,
  userId: string,
) => {
  const data = { ...payload, user: { connect: { id: userId } } };
  const project = await prisma.project.create({
    data,
  });
  return project;
};

const getAllProjects = async (userId: string) => {
  const projects = await prisma.project.findMany({
    where: { user: { id: userId } },
  });
  return projects;
};

const updateProject = async (
  id: string,
  userId: string,
  payload: Partial<Prisma.ProjectCreateInput>,
) => {
  const findproject = await prisma.project.findUnique({
    where: { id_userId: { id, userId } },
  });
  if (!findproject) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  const project = await prisma.project.update({
    where: { id_userId: { id, userId } },
    data: payload,
  });
  return project;
};

export const projectService = {
  createNewProject,
  getAllProjects,
  updateProject,
};
