import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { CORS_ORIGIN } from "./config/env.js";
import { login } from "./controllers/users.controller.js";
import { authenticate, authenticateRoles } from "./middlewares/verifyToken.js";
const app = express();

// Rutas
import usersRoutes from "./routes/users.routes.js";
import studentsRoutes from "./routes/students.routes.js";
import coursesRoutes from "./routes/courses.routes.js";
import schedulesRoutes from "./routes/schedules.routes.js";

// Logs para desarrollo
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// CORS, permite peticiones de otros dominios
app.use(cors({
    origin: CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// Middlewares de express para parsear el cuerpo de las peticiones
app.use(express.json({ type: "application/json" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Ruta para login
app.post("/api", login);

// Rutas administrativas
app.use("/api/users", authenticate, authenticateRoles("Administrador"), usersRoutes);
app.use("/api/students", authenticate, authenticateRoles("Administrador"), studentsRoutes);
app.use("/api/courses", authenticate, coursesRoutes);
app.use("/api/schedules", authenticate, schedulesRoutes);

export default app;