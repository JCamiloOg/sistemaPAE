import conn from "../config/db.js";

export async function insertAssistance(assistance) {
    const [result] = await conn.query("INSERT INTO asistencia SET ?", [assistance]);
    return result;
}

export async function modifyAssistance(assistance, id) {
    const [result] = await conn.query("UPDATE asistencia SET ? WHERE id_asistencia = ?", [assistance, id]);
    return result;
}


export async function findAllAssistanceByDateAndCourse(id_course, fecha) {
    const [result] = await conn.query("SELECT g.grado, e.documento, e.nombre, e.apellido, a.fecha, a.hora_ingreso, e.estado, a.estado AS asistencia, a.id_asistencia FROM asistencia a INNER JOIN estudiantes e ON e.documento = a.id_estudiante INNER JOIN grados g ON g.id_grado = e.grado WHERE e.grado = ? AND a.fecha = ?", [id_course, fecha]);
    return result;
}

export async function findDatesAssistance(course) {
    const [result] = await conn.query("SELECT DISTINCT a.fecha FROM asistencia a INNER JOIN estudiantes e ON e.documento = a.id_estudiante INNER JOIN grados g ON g.id_grado = e.grado WHERE e.grado = ?", [course]);
    return result;
}