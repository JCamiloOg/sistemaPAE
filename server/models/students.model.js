import conn from "../config/db.js";

export async function findAllStudents() {
    const [rows] = await conn.query("SELECT * FROM estudiantes");
    return rows;
}

export async function findStudentByDocument(document) {
    const [rows] = await conn.query("SELECT * FROM estudiantes WHERE documento = ?", [document]);
    return rows[0];
}

export async function insertStudent(student) {
    const [result] = await conn.query("INSERT INTO estudiantes SET ?", [student]);
    return result;
}


export async function modifyStudent(student, document) {
    const [result] = await conn.query("UPDATE estudiantes SET ? WHERE documento = ?", [student, document]);
    return result;
}

