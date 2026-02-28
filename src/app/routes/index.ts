import { Router } from "express";
import { userRoutes } from "../modules/user/user.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { projectRoutes } from "../modules/projects/project.routes";

const router = Router();

const routes = [
  {
    path: "/user",
    router: userRoutes,
  },
  {
    path: "/auth",
    router:authRoutes
  },
  {
    path: "/project",
    router:projectRoutes,
  }
];

routes.forEach((route) => {
  router.use(route.path, route.router);
});

export default router;
