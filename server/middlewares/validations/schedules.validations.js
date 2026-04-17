import { body } from "express-validator";

// Validaciones
export const insertScheduleValidations = [
    body(["startSchedule", "endSchedule"])
        .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
        .withMessage("El horario debe tener el formato correcto. Ej: 00:00:00."),
    body("course")
        .isNumeric()
        .withMessage("El grado no es válido."),
    body("turn")
        .isIn(['Mañana', 'Tarde'])
        .withMessage("El turno es incorrecto."),
];

export const updateScheduleValidations = [
    ...insertScheduleValidations
];

