import { Router } from "express";
import { insertUserValidations, updateUserValidations } from "../middlewares/validations/user.validations.js";
import { validationErrors } from "../middlewares/validations/validationErrors.js";
import { createUser, getUsers, updateUser } from "../controllers/users.controller.js";

// enrutador de express
const router = Router();

// Rutas para obtener usuarios o usuario por documento
router.get("/", getUsers);

/* los ":"" despues del / ej: /users/:document se refieren un parametro enviado en la ruta en este caso el documento del usuario ejemplo: /users/12345678 */
router.get("/:document", getUsers);

// Ruta para crear un usuario
router.post("/", insertUserValidations, validationErrors, createUser);

// Rutas para actualizar un usuario
router.put("/:document", updateUserValidations, validationErrors, updateUser);
router.put("/status/:document", createUser);

// Exportar el enrutador
export default router;