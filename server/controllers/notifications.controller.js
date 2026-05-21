import { countNotifications, findAllNotifications, findNotificationByID, insertNotification, inserNotificationUser, updateNotification as updateNotificationModel } from "../models/notifications.model.js";
import { sqlDateFormat, sqlTimeFormat } from "../utils/formatDate.js";

export async function getNotifications(req, res) {
    try {
        const { id } = req.params;

        if (id) {
            const notification = await findNotificationByID(id);
            if (!notification) return res.status(404).json({ message: "Notificación no encontrada." });
            return res.status(200).json({ notification });
        }

        let page = Number(req.query.page);

        if (isNaN(page)) page = 1;

        const limit = 5;
        const offset = (page - 1) * limit;

        const count = await countNotifications();

        const totalPages = Math.ceil(count.count / limit);

        if (page > totalPages && totalPages > 0) return res.status(400).json({ message: "La página no existe." });

        const notifications = await findAllNotifications(offset, limit);

        return res.status(200).json({ notifications, totalPages: totalPages || 1 });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al obtener las notificaciones." });
    }
}

export async function createNotification(req, res) {
    try {
        if (!req.body) return res.status(400).json({ message: "No se recibieron datos." });

        const { title, message, type } = req.body;
        const userId = req.user.documento;

        const newNotification = {
            titulo: title,
            mensaje: message,
            fecha: `${sqlDateFormat(new Date())} ${sqlTimeFormat(new Date())}`,
            tipo: type
        };

        const result = await insertNotification(newNotification);

        if (!result || !result.affectedRows) {
            return res.status(500).json({ message: "Error al crear la notificación." });
        }

        const id_notification = result.insertId;

        const associationResult = await inserNotificationUser({
            id_notificacion: id_notification,
            id_usuario: userId
        });

        if (!associationResult || !associationResult.affectedRows) {
            return res.status(500).json({ message: "Error al asociar la notificación al usuario." });
        }

        return res.status(201).json({ message: "Notificación creada exitosamente." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al crear la notificación." });
    }
}

export async function updateNotification(req, res) {
    try {
        if (!req.body) return res.status(400).json({ message: "No se recibieron datos." });

        const { id } = req.params;
        const { title, message } = req.body;

        const notificationExist = await findNotificationByID(id);


        if (!notificationExist) return res.status(404).json({ message: "Notificación no encontrada." });

        const updatedData = {
            titulo: title,
            mensaje: message,
        };

        const result = await updateNotificationModel(updatedData, id);

        if (!result) return res.status(500).json({ message: "Error al actualizar la notificación." });


        return res.status(200).json({ message: "Notificación actualizada exitosamente." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al actualizar la notificación." });
    }
}


export async function updateTypeNotification(req, res) {
    try {
        if (!req.body) return res.status(400).json({ message: "No se recibieron datos." });

        const { id } = req.params;
        const { type } = req.body;

        const notificationExist = await findNotificationByID(id);

        if (!notificationExist) return res.status(404).json({ message: "Notificación no encontrada." });

        const updatedData = {
            tipo: type
        };

        const result = await updateNotificationModel(updatedData, id);

        if (!result) return res.status(500).json({ message: "Error al actualizar la notificación." });

        return res.status(200).json({ message: "Notificación actualizada exitosamente." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al actualizar la notificación." });
    }
}