import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { CORS_ORIGIN } from "./config/env.js";
import usersRoute from "./routes/users.route.js";
import { login } from "./controllers/users.controller.js";
import { verifyTokenAdmin } from "./middlewares/verifyToken.js";
const app = express();

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

app.use("/api/users", verifyTokenAdmin, usersRoute);

export default app;