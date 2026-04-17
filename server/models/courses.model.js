import conn from "../config/db.js";

/* ASYNC AWAIT es para que el código espere a que se resuelva la consulta sql para seguir con la lógica */

// consultas a la base de datos

// obtener grado por id
export async function findCourseByID(id) {
    const [rows] = await conn.query("SELECT * FROM grados WHERE id_grado = ?", [id]);
    return rows[0];
}

// obtener grado por nombre
export async function findCourseByName(name) {
    const [rows] = await conn.query("SELECT * FROM grados WHERE grado = ?", [name]);
    return rows[0];
}

// obtener todos los grados
export async function findAllCourses() {
    const [rows] = await conn.query("SELECT * FROM grados");
    return rows;
}

// insertar grado
export async function insertCourse(course) {
    const [result] = await conn.query("INSERT INTO grados SET ?", [course]);
    return result;
}

// modificar grado
export async function modifyCourse(course, id) {
    const [result] = await conn.query("UPDATE grados SET ? WHERE id_grado = ?", [course, id]);
    return result;
}
// eliminar grado
export async function removeCourse(id) {
    const [result] = await conn.query("DELETE FROM grados WHERE id_grado = ?", [id]);
    return result;
}