import { Router } from "express";
import { createStudent, getStudents, updateStudent } from "../controllers/students.controller.js";
import { insertStudentValidations, updateStudentValidations } from "../middlewares/validations/students.validations.js";
import { validationErrors } from "../middlewares/validations/validationErrors.js";

// Enrutador de express
const router = Router();
// Rutas para obtener estudiantes o estudiante por documento
router.get("/", getStudents);
router.get("/:document", getStudents);

// Ruta para crear un estudiante
router.post("/", insertStudentValidations, validationErrors, createStudent);

// Rutas para actualizar un estudiante
router.put("/:document", updateStudentValidations, validationErrors, updateStudent);
router.put("/status/:document", updateStudent);


export default router;
