import { body } from "express-validator";


export const insertCourseValidations = [
    body("course")
        .matches(/^(?:[0-9]|1[01])-\d+$/)
        .withMessage("El grado debe tener el formato correcto. Ej: 1-1."),
];

export const updateCourseValidations = [
    ...insertCourseValidations
];