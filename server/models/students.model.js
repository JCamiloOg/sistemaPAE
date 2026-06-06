import conn from "../config/db.js";

// consultas a la base de datos

// obtener todos los estudiantes
export async function findAllStudents() {
    const [rows] = await conn.query("SELECT E.documento, E.nombre, E.apellido, G.grado, G.id_grado, E.create_at, E.estado FROM estudiantes E INNER JOIN grados G ON E.grado = G.id_grado");
    return rows;
}

export async function findStudentsByCourse(course, limit, offset) {
    const [rows] = await conn.query("SELECT E.documento, E.nombre, E.apellido, G.grado, G.id_grado, E.create_at, E.estado FROM estudiantes E INNER JOIN grados G ON E.grado = G.id_grado WHERE E.grado = ? LIMIT ?,?", [course, offset, limit]);
    return rows;
}

export async function findStudentsByCourseAndSearch(course, search, limit, offset) {
    const [rows] = await conn.query("SELECT E.documento, E.nombre, E.apellido, G.grado, G.id_grado, E.create_at, E.estado FROM estudiantes E INNER JOIN grados G ON E.grado = G.id_grado WHERE E.grado = ? AND (E.documento LIKE ? OR E.nombre LIKE ? OR E.apellido LIKE ?) LIMIT ?,?", [course, `%${search}%`, `%${search}%`, `%${search}%`, offset, limit]);
    return rows;
}

export async function countStudentsBySearchAndCourse(search, course) {
    const [rows] = await conn.query("SELECT COUNT(*) AS total FROM estudiantes WHERE grado = ? AND (documento LIKE ? OR nombre LIKE ? OR apellido LIKE ?)", [course, `%${search}%`, `%${search}%`, `%${search}%`]);
    return rows[0].total;
}

export async function countStudentsByCourse(course) {
    const [rows] = await conn.query("SELECT COUNT(*) AS total FROM estudiantes WHERE grado = ?", [course]);
    return rows[0].total;
}

// obtener estudiante por documento
export async function findStudentByDocument(document) {
    const [rows] = await conn.query("SELECT E.documento, E.nombre, E.apellido, G.grado, G.id_grado, E.create_at, E.estado FROM estudiantes E INNER JOIN grados G ON E.grado = G.id_grado WHERE E.documento = ?", [document]);
    return rows[0];
}

export async function findStudentByCourse(id) {
    const [rows] = await conn.query("SELECT E.documento, E.nombre, E.apellido, G.grado, G.id_grado, E.create_at, E.estado FROM estudiantes E INNER JOIN grados G ON E.grado = G.id_grado WHERE E.grado = ?", [id]);
    return rows;
}

// obtener estudiante por grado
export async function insertStudent(student) {
    const [result] = await conn.query("INSERT INTO estudiantes SET ?", [student]);
    return result;
}

// modificar estudiante
export async function modifyStudent(student, document) {
    const [result] = await conn.query("UPDATE estudiantes SET ? WHERE documento = ?", [student, document]);
    return result;
}

