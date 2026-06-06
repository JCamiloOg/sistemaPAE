import { Router } from "express";
import { createNotification, getNotifications, updateNotification, updateTypeNotification } from "../controllers/notifications.controller.js";
import { insertNotificationValidations, updateNotificationValidations } from "../middlewares/validations/notifications.validations.js";
import { validationErrors } from "../middlewares/validations/validationErrors.js";

// Enrutador de express
const router = Router();

// Rutas para obtener notificaciones o notificación por id
router.get("/", getNotifications);
router.get("/:id", getNotifications);

// Ruta para crear una notificación
router.post("/", insertNotificationValidations, validationErrors, createNotification);

// Ruta para actualizar una notificación
router.put("/:id", updateNotificationValidations, validationErrors, updateNotification);
router.put("/:id/type", updateTypeNotification);

export default router;
