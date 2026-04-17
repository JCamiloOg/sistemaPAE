import conn from "../config/db.js";

// consultas a la base de datos

// obtener todos los horarios
export async function findAllSchedules() {
    const [rows] = await conn.query("SELECT H.*, G.grado FROM horarios H INNER JOIN grados G ON H.id_grado = G.id_grado");
    return rows;
}

// obtener horario por id
export async function findScheduleByID(id) {
    const [rows] = await conn.query("SELECT H.*, G.grado FROM horarios H INNER JOIN grados G ON H.id_grado = G.id_grado WHERE H.id_horario = ?", [id]);
    return rows[0];
}

// obtener horario por grado
export async function findScheduleByCourse(id) {
    const [rows] = await conn.query("SELECT H.* FROM horarios H INNER JOIN grados G ON H.id_grado = G.id_grado WHERE H.id_grado = ?", [id]);
    return rows[0];
}

// insertar horario
export async function insertSchedule(schedule) {
    const [result] = await conn.query("INSERT INTO horarios SET ?", [schedule]);
    return result;
}

// modificar horario
export async function modifySchedule(schedule, id) {
    const [result] = await conn.query("UPDATE horarios SET ? WHERE id_horario = ?", [schedule, id]);
    return result;
}

// eliminar horario
export async function removeSchedule(id) {
    const [result] = await conn.query("DELETE FROM horarios WHERE id_horario = ?", [id]);
    return result;
}