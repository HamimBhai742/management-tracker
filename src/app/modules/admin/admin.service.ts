import { prisma } from "../../utils/prisma";

const getStats = async () => {
  const totalProjectsValue = await prisma.project.aggregate({
    _sum: {
      value: true,
    },
  });
  const totalProjects = await prisma.project.count();
  const totalPlannedProjects = await prisma.project.count({
    where: {
      status: "PLANNED",
    },
  });
  const totalOHoldProjects = await prisma.project.count({
    where: {
      status: "ON_HOLD",
    },
  });
  const totalInProgressProjects = await prisma.project.count({
    where: {
      status: "IN_PROGRESS",
    },
  });

  const totalCompletedProjects = await prisma.project.count({
    where: {
      status: "COMPLETED",
    },
  });

  const totalUsers = await prisma.user.count();

  return {
    totalProjectsValue: totalProjectsValue._sum.value,
    totalProjects,
    totalPlannedProjects,
    totalOHoldProjects,
    totalInProgressProjects,
    totalCompletedProjects,
    totalUsers,
  };
};

export const AdminService = {
  getStats,
};
