import { body } from "express-validator";

export const insertValidate = [
    body("document")
        .isLength({ min: 6, max: 20 })
        .withMessage("El documento debe tener entre 6 y 20 caracteres.")
        .isNumeric()
        .withMessage("El documento debe ser numérico."),
    body("password")
        .isLength({ min: 8, max: 20 })
        .withMessage("La contraseña debe tener entre 8 y 20 caracteres."),
    body("role")
        .isNumeric()
        .withMessage("El rol no es válido."),
    body("email")
        .isEmail()
        .withMessage("El correo electrónico no es válido."),
    body("name")
        .isLength({ min: 2, max: 50 })
        .withMessage("El nombre debe tener entre 2 y 50 caracteres."),
    body("lastName")
        .isLength({ min: 2, max: 50 })
        .withMessage("El apellido debe tener entre 2 y 50 caracteres."),
];

export const updateValidate = [
    body("password")
        .optional({ checkFalsy: true })
        .isLength({ min: 8, max: 20 })
        .withMessage("La contraseña debe tener entre 8 y 20 caracteres."),
    body("role")
        .isNumeric()
        .withMessage("El rol no es válido."),
    body("email")
        .isEmail()
        .withMessage("El correo electrónico no es válido."),
    body("name")
        .isLength({ min: 2, max: 50 })
        .withMessage("El nombre debe tener entre 2 y 50 caracteres."),
    body("lastName")
        .isLength({ min: 2, max: 50 })
        .withMessage("El apellido debe tener entre 2 y 50 caracteres."),
];