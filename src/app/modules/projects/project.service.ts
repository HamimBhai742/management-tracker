import { Prisma } from "../../../generated/prisma/client";
import { AppError } from "../../error";
import { prisma } from "../../utils/prisma";
import httpStatus from "http-status";

const createNewProject = async (
  payload: Prisma.ProjectCreateInput,
  userId: string,
) => {
  const startDate = new Date(payload?.startDate);
  const endDate = new Date(payload?.endDate || "");
  const data = {
    ...payload,
    user: { connect: { id: userId } },
    startDate,
    endDate,
  };
  const project = await prisma.project.create({
    data,
  });
  return project;
};

const getAllProjects = async (
  userId: string,
  filter: any,
  page: number,
  limit: number,
  search: string,
  sortBy: string,
  sortOrder: "asc" | "desc",
) => {
  const where: any = {
    AND: [
      search && {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
      filter && filter,
      userId && { user: { id: userId } },
    ].filter(Boolean),
  };

  const projects = await prisma.project.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.project.count({
    where,
  });

  const totalPages = Math.ceil(total / limit);

  const metaData = {
    total,
    pages: totalPages,
    limit,
    totalPages,
  };
  return {
    projects,
    metaData,
  };
};

const getSingleProject = async (id: string, userId: string) => {
  const project = await prisma.project.findUnique({
    where: { id_userId: { id, userId } },
  });
  return project;
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

const deleteProject = async (id: string, userId: string) => {
  const project = await prisma.project.delete({
    where: { id_userId: { id, userId } },
  });
  return project;
};

const stats = async (id: string) => {
  const totalProjects = await prisma.project.count();
  const totalInProgressProjects = await prisma.project.count({
    where: {
      status: "IN_PROGRESS",
      userId: id,
    },
  });
  const totalCompletedProjects = await prisma.project.count({
    where: {
      status: "COMPLETED",
      userId: id,
    },
  });
  const totalValue = await prisma.project.aggregate({
    _sum: {
      value: true,
    },
    where: {
      userId: id,
    },
  });

  return {
    totalProjects,
    totalInProgressProjects,
    totalCompletedProjects,
    totalValue: totalValue._sum.value,
  };
};

export const projectService = {
  createNewProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  deleteProject,
  stats,
};
