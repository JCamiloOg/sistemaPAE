import { validationResult } from "express-validator";

/* Los MIDDLEWARES son funciones que se ejecutan antes de las rutas para validar alguna acción en especifico */

// en este caso para validar que las validaciones del body de los demás archivos sean correctas
export function validationErrors(req, res, next) {
    const errors = validationResult(req);

    // si hay errores
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

    // si no hay errores
    next();
}