import conn from "../config/db.js";

export async function findAllNotifications(offset, limit) {
    const [rows] = await conn.query("SELECT N.id_notificacion, N.titulo, N.mensaje, N.fecha, N.tipo, CONCAT(U.nombre, ' ', U.apellido) AS usuario, U.documento FROM usuario_notificacion UN INNER JOIN notificaciones N ON UN.id_notificacion = N.id_notificacion INNER JOIN usuarios U ON UN.id_usuario = U.documento ORDER BY N.fecha DESC LIMIT ?,?", [offset, limit]);
    return rows;
}

export async function findNotificationByID(id) {
    const [rows] = await conn.query("SELECT N.id_notificacion, N.titulo, N.mensaje, N.fecha, N.tipo, CONCAT(U.nombre, ' ', U.apellido) AS usuario, U.documento FROM usuario_notificacion UN INNER JOIN notificaciones N ON UN.id_notificacion = N.id_notificacion INNER JOIN usuarios U ON UN.id_usuario = U.documento WHERE N.id_notificacion = ?", [id]);
    return rows[0];
}

export async function countNotifications() {
    const [rows] = await conn.query("SELECT COUNT(*) AS count FROM notificaciones");
    return rows[0];
}

export async function inserNotificationUser(data) {
    const [result] = await conn.query("INSERT INTO usuario_notificacion SET ?", [data]);
    return result;
}

export async function insertNotification(notification) {
    const [result] = await conn.query("INSERT INTO notificaciones SET ?", [notification]);
    return result;
}

export async function updateNotification(notification, id) {
    const [result] = await conn.query("UPDATE notificaciones SET ? WHERE id_notificacion = ?", [notification, id]);
    return result;
}

