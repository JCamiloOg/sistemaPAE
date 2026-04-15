import conn from "../config/db.js";


export async function findAllUsers() {
    const [rows] = await conn.query("SELECT * FROM usuarios");
    return rows;
}

export async function findUserByDocument(document) {
    const [rows] = await conn.query("SELECT * FROM usuarios WHERE documento = ?", [document]);
    return rows[0];
}

export async function insertUser(user) {
    const [result] = await conn.query("INSERT INTO usuarios SET ?", [user]);
    return result;
}

export async function modifyUser(user, document) {
    const [result] = await conn.query("UPDATE usuarios SET ? WHERE documento = ?", [user, document]);
    return result;
}