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

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(cors({
    origin: CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));





app.use(express.json({ type: "application/json" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.post("/api", login);

app.use("/api/users", authenticate, authenticateRoles("Administrador"), usersRoutes);
app.use("/api/students", authenticate, authenticateRoles("Administrador"), studentsRoutes);
app.use("/api/courses", authenticate, authenticateRoles("Administrador"), coursesRoutes);

export default app;