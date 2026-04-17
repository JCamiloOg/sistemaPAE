import { body } from "express-validator";

/* BODY es el dato een concreto queque viene en la peticion o formularios */
// Validaciones

export const insertCourseValidations = [
    body("course")
        // que tenga el formato correcto Ej: 1-1
        .matches(/^(?:[0-9]|1[01])-\d+$/)
        .withMessage("El grado debe tener el formato correcto. Ej: 1-1."),
];

export const updateCourseValidations = [
    ...insertCourseValidations
];