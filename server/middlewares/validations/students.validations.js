import { body } from "express-validator";

export const insertStudentValidations = [
    body("document")
        .isLength({ min: 6, max: 20 })
        .withMessage("El documento debe tener entre 6 y 20 caracteres.")
        .isNumeric()
        .withMessage("El documento debe ser numérico."),
    body("course")
        .isNumeric()
        .withMessage("El grado no es válido."),
    body("name")
        .isLength({ min: 2, max: 50 })
        .withMessage("El nombre debe tener entre 2 y 50 caracteres."),
    body("lastName")
        .isLength({ min: 2, max: 50 })
        .withMessage("El apellido debe tener entre 2 y 50 caracteres."),
];


export const updateStudentValidations = [
    ...insertStudentValidations,
    body("status")
        .isIn(['Matriculado', 'Retirado'])
        .withMessage("El estado es incorrecto."),
];
