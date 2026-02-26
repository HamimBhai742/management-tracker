import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middleware/validationRequest";
import { userZodSchema } from "./user.zod.schema";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../interface/user.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(userZodSchema),
  userController.registerUser,
);

router.post("/otp-verify", userController.otpVerify);

router.post("/resend-otp", userController.resendOtp);

router.post("/forget-password", userController.forgetPassword);

router.get("/", userController.getAllUsers);

router.put("/", checkAuth(Role.USER), userController.updateUser);

export const userRoutes = router;
