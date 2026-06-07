import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { CORS_ORIGIN } from "./config/env.js";
const app = express();

import routes from "./routes/index.routes.js";
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Api Sistema PAE en linea.");
});

app.use("/api", routes);

export default app;