import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../interface/user.interface";

const router = Router();

router.post("/login", authController.login);

router.post(
  "/change-password",
  checkAuth(Role.USER),
  authController.changePassword,
);

export const authRoutes = router;
