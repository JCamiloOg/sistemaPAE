import sql from "mysql2/promise.js";

// importamos las variables
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "./env.js";

// creamos la conexion a la base de datos
export const db = sql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT
});

// exportamos la conexion
export default db;