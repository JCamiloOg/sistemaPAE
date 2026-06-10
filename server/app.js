import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { CORS_ORIGIN } from "./config/env.js";

const app = express();

import routes from "./routes/index.routes.js";
// Logs para desarrollo
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(helmet());

// CORS, permite peticiones de otros dominios
app.use(cors({
    origin: CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200
}));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 peticiones por ventana
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        ok: false,
        message: "Demasiados intentos, por favor intente de nuevo en 15 minutos",
        status: 429
    }
});

// Middlewares de express para parsear el cuerpo de las peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Api Sistema PAE en linea.");
});


app.use("/api/", apiLimiter);
app.use("/api", routes);

export default app;