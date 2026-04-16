import conn from "../config/db.js";

export async function findCourseByID(id) {
    const [rows] = await conn.query("SELECT * FROM grados WHERE id_grado = ?", [id]);
    return rows[0];
}

export async function findCourseByName(name) {
    const [rows] = await conn.query("SELECT * FROM grados WHERE grado = ?", [name]);
    return rows[0];
}

export async function insertCourse(course) {
    const [result] = await conn.query("INSERT INTO grados SET ?", [course]);
    return result;
}

export async function findAllCourses() {
    const [rows] = await conn.query("SELECT * FROM grados");
    return rows;
}

export async function modifyCourse(course, id) {
    const [result] = await conn.query("UPDATE grados SET ? WHERE id_grado = ?", [course, id]);
    return result;
}

export async function removeCourse(id) {
    const [result] = await conn.query("DELETE FROM grados WHERE id_grado = ?", [id]);
    return result;
}