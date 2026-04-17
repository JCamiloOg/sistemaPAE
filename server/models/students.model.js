import conn from "../config/db.js";

// consultas a la base de datos

// obtener todos los estudiantes
export async function findAllStudents() {
    const [rows] = await conn.query("SELECT E.documento, E.nombre, E.apellido, G.grado, G.id_grado, E.create_at, E.estado FROM estudiantes E INNER JOIN grados G ON E.grado = G.id_grado");
    return rows;
}

// obtener estudiante por documento
export async function findStudentByDocument(document) {
    const [rows] = await conn.query("SELECT E.documento, E.nombre, E.apellido, G.grado, G.id_grado, E.create_at, E.estado FROM estudiantes E INNER JOIN grados G ON E.grado = G.id_grado WHERE E.documento = ?", [document]);
    return rows[0];
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

