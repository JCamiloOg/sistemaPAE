import conn from "../config/db.js";

/* ASYNC AWAIT es para que el código espere a que se resuelva la consulta sql para seguir con la lógica */

// consultas a la base de datos

// obtener grado por id
export async function findCourseByID(id) {
    const [rows] = await conn.query("SELECT * FROM grados WHERE id_grado = ?", [id]);
    return rows[0];
}

export async function findAllCoursesWithSchedule(offset = 0, limit = 1000) {
    const [rows] = await conn.query("SELECT G.*, H.id_horario, H.hora_inicio, H.hora_fin, H.turno FROM grados G INNER JOIN horarios H ON G.id_grado = H.id_grado LIMIT ?,?", [offset, limit]);
    return rows;
}

export async function countCourses() {
    const [rows] = await conn.query("SELECT COUNT(*) AS total FROM grados");
    return rows[0].total;
}

// obtener grado por nombre
export async function findCourseByName(name) {
    const [rows] = await conn.query("SELECT * FROM grados WHERE grado = ?", [name]);
    return rows[0];
}

// obtener todos los grados
export async function findAllCourses() {
    const [rows] = await conn.query("SELECT * FROM grados ORDER BY CAST(SUBSTRING_INDEX(grado, '-', 1) AS UNSIGNED), CAST(SUBSTRING_INDEX(grado, '-', -1) AS UNSIGNED);");
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