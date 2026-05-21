import { body } from "express-validator";

/* BODY es el dato een concreto queque viene en la peticion o formularios */
// Validaciones

export const insertCourseValidations = [
    body("course")
        // que tenga el formato correcto Ej: 1-1
        .matches(/^(?:[0-9]|1[01])-\d+$/)
        .withMessage("El grado debe tener el formato correcto. Ej: 1-1."),
    body(["start_time", "end_time"])
        .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
        .withMessage("El horario debe tener el formato correcto. Ej: 00:00:00."),
    body("turn")
        .isIn(['Mañana', 'Tarde'])
        .withMessage("El turno es incorrecto."),
];

export const updateCourseValidations = [
    ...insertCourseValidations,
    body("id_schedule")
        .isNumeric()
        .withMessage("El id del horario no es válido."),
];