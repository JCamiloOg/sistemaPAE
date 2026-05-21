import { body, param } from "express-validator";

export const insertNotificationValidations = [
    body("title")
        .isLength({ min: 1, max: 100 })
        .withMessage("El título debe tener entre 1 y 100 caracteres."),
    body("message")
        .notEmpty()
        .withMessage("El mensaje no puede estar vacío."),
    body("type")
        .isIn(['Urgente', 'Información', 'General'])
        .withMessage("El tipo debe ser urgente, información o general."),
];

export const updateNotificationValidations = [
    param("id")
        .isInt()
        .withMessage("El id de la notificación debe ser un número entero."),
    body("title")
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage("El título debe tener entre 1 y 100 caracteres."),
    body("message")
        .optional()
        .notEmpty()
        .withMessage("El mensaje no puede estar vacío."),
];
