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

router.post("/otp-verify", userController.otpVerify);

router.post("/resend-otp", userController.resendOtp);

export const userRoutes = router;
