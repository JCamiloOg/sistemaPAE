import { Router } from "express";
import { createStudent, getStudents, updateStatusStudent, updateStudent } from "../controllers/students.controller.js";
import { insertStudentValidations, updateStudentValidations } from "../middlewares/validations/students.validations.js";
import { validationErrors } from "../middlewares/validations/validationErrors.js";
import { authenticateRoles } from "../middlewares/verifyToken.js";

// Enrutador de express
const router = Router();
// Rutas para obtener estudiantes o estudiante por documento
router.get("/", authenticateRoles("Administrador", "Encargado PAE"), getStudents);
router.get("/:document", authenticateRoles("Administrador", "Encargado PAE"), getStudents);

// Ruta para crear un estudiante
router.post("/", authenticateRoles("Administrador"), insertStudentValidations, validationErrors, createStudent);

// Rutas para actualizar un estudiante
router.put("/:document", authenticateRoles("Administrador"), updateStudentValidations, validationErrors, updateStudent);
router.put("/status/:document", authenticateRoles("Administrador"), updateStatusStudent);


export default router;
