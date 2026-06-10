import dotenv from "dotenv";

/* Las variables de entorno son variables que se definen en el archivo .env, estas variables se usan para configurar el servidor en diferentes entornos como por ejemplo el entorno de desarrollo, el entorno de produccion, otras maquinas o etc */
const env = process.env.NODE_ENV || "development";

dotenv.config({
    path: `.env.${env}`
});

/* El || es para que si la variable no esta definida se use el valor por defecto */

const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || "localhost";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || 3306;
const DB_NAME = process.env.DB_NAME || "gestion_pae";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const ACCESS_SECRET = process.env.ACCESS_SECRET || "secret_key";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "secret_key";

// exportamos las variables
export { NODE_ENV, PORT, HOSTNAME, CORS_ORIGIN, DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, ACCESS_SECRET, REFRESH_SECRET };

