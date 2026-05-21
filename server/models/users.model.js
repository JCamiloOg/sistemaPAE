import conn from "../config/db.js";

// consultas a la base de datos

// obtener todos los usuarios
export async function findAllUsers(offset, limit) {
    const [rows] = await conn.query(`SELECT U.*, R.rol, R.id_rol FROM usuarios U INNER JOIN roles R ON U.role_id = R.id_rol LIMIT ?,?`, [offset, limit]);
    return rows;
}

export async function countUsers() {
    const [rows] = await conn.query("SELECT COUNT(*) AS total FROM usuarios");
    return rows[0].total;
}

// obtener usuario por documento
export async function findUserByDocument(document) {
    const [rows] = await conn.query("SELECT U.*, R.rol FROM usuarios U INNER JOIN roles R ON U.role_id = R.id_rol WHERE documento = ?", [document]);
    return rows[0];
}

// insertar usuario
export async function insertUser(user) {
    const [result] = await conn.query("INSERT INTO usuarios SET ?", [user]);
    return result;
}

// modificar usuario
export async function modifyUser(user, document) {
    const [result] = await conn.query("UPDATE usuarios SET ? WHERE documento = ?", [user, document]);
    return result;
}