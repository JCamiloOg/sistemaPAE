import { dashboard, login, logout, verifyToken } from "../controllers/users.controller.js";
import { authenticate, authenticateRoles } from "../middlewares/verifyToken.js";
import coursesRoutes from "./courses.routes.js";
import schedulesRoutes from "./schedules.routes.js";
import studentsRoutes from "./students.routes.js";
import usersRoutes from "./users.routes.js";
import assistanceRoutes from "./assistance.routes.js";
import notificationsRoutes from "./notifications.routes.js";
import { Router } from "express";

const router = Router();


// Ruta para login
router.get("/", verifyToken);
router.post("/", login);

// Rutas administrativas
router.get("/dashboard", authenticate, authenticateRoles("Administrador", "Encargado PAE"), dashboard);

router.use("/users", authenticate, authenticateRoles("Administrador"), usersRoutes);
router.use("/students", authenticate, authenticateRoles("Administrador"), studentsRoutes);
router.use("/courses", authenticate, coursesRoutes);
router.use("/schedules", authenticate, schedulesRoutes);
router.use("/assistance", authenticate, authenticateRoles("Administrador", "Encargado PAE"), assistanceRoutes);
router.use("/notifications", authenticate, authenticateRoles("Administrador"), notificationsRoutes);
router.post("/logout", authenticate, logout);

export default router;
