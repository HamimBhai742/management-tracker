import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../interface/user.interface";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/stats", checkAuth(Role.ADMIN), adminController.getStats);


export const adminRoutes = router;