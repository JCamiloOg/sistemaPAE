import { Router } from "express";
import { createCourse, deleteCourse, getCourses, updateCourse } from "../controllers/courses.controller.js";
import { insertCourseValidations, updateCourseValidations } from "../middlewares/validations/courses.validations.js";
import { validationErrors } from "../middlewares/validations/validationErrors.js";
import { authenticateRoles } from "../middlewares/verifyToken.js";

// Enrutador de express
const router = Router();

// Rutas para obtener grados o grado por id
router.get("/", authenticateRoles("Administrador", "Encargado PAE"), getCourses);
router.get("/:id", authenticateRoles("Administrador", "Encargado PAE"), getCourses);

// Ruta para crear un grado
router.post("/", authenticateRoles("Administrador"), insertCourseValidations, validationErrors, createCourse);

// Rutas para actualizar un grado
router.put("/:id", authenticateRoles("Administrador"), updateCourseValidations, validationErrors, updateCourse);

// Ruta para eliminar un grado
router.delete("/:id", authenticateRoles("Administrador"), deleteCourse);

export default router;