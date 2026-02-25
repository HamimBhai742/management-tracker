import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middleware/validationRequest";
import { userZodSchema } from "./user.zod.schema";

const router = Router();

router.post(
  "/register",
  validateRequest(userZodSchema),
  userController.registerUser,
);

export const userRoutes = router;
