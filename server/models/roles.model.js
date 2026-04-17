import conn from "../config/db.js";

// obtener rol por id
export async function findRoleById(id) {
    const [rows] = await conn.query("SELECT * FROM roles WHERE id_rol = ?", [id]);
    return rows[0];
}