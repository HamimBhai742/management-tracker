import { Router } from "express";
import { projectController } from "./project.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../interface/user.interface";
import { validateRequest } from "../../middleware/validationRequest";
import { ProjectSchema, UpdateProjectSchema } from "./project.zod.schema";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.USER),
  validateRequest(ProjectSchema),
  projectController.createProject,
);

router.get("/stats", checkAuth(Role.USER), projectController.stats);

router.get("/all", checkAuth(Role.USER), projectController.getAllProjects);

router.get("/:id", checkAuth(Role.USER), projectController.getSingleProject);

router.put(
  "/update/:id",
  checkAuth(Role.USER),
  validateRequest(UpdateProjectSchema),
  projectController.updateProject,
);

router.delete(
  "/delete/:id",
  checkAuth(Role.USER),
  projectController.deleteProject,
);


export const projectRoutes = router;
