import z from "zod";

export const userZodSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string().min(3),
  role: z.enum(["ADMIN", "USER"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "BLOCKED"]).optional(),
});


