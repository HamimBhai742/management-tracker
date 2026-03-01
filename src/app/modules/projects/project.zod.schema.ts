import { z } from "zod";

// Enum for ProjectStatus
export const ProjectStatusEnum = z.enum([
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
  "ON_HOLD",
]);
// adjust values based on your Prisma enum

export const ProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date" }),
  endDate: z
    .string()
    .optional()
    .refine((date) => date === undefined || !isNaN(Date.parse(date)), {
      message: "Invalid date",
    }),
  clientName: z.string().min(1, "Client name is required"),
  status: ProjectStatusEnum,
  value: z.number()
});

// update ProjectSchema
export const UpdateProjectSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  startDate: z
    .string()
    .optional()
    .refine((date) => date === undefined || !isNaN(Date.parse(date)), {
      message: "Invalid date",
    }),
  endDate: z
    .string()
    .optional()
    .refine((date) => date === undefined || !isNaN(Date.parse(date)), {
      message: "Invalid date",
    }),
  clientName: z.string().optional(),
  status: ProjectStatusEnum.optional(),
  value: z.number().optional(),
});
