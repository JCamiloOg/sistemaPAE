import { Router } from "express";
import { createSchedule, deleteSchedule, getSchedules, updateSchedule } from "../controllers/schedules.controller.js";
import { insertScheduleValidations, updateScheduleValidations } from "../middlewares/validations/schedules.validations.js";
import { validationErrors } from "../middlewares/validations/validationErrors.js";
import { authenticateRoles } from "../middlewares/verifyToken.js";

// Enrutador de express
const router = Router();

// Rutas para obtener horarios o horario por id
router.get("/", authenticateRoles("Administrador", "Encargado PAE"), getSchedules);
router.get("/:id", authenticateRoles("Administrador", "Encargado PAE"), getSchedules);

// Ruta para crear un horario
router.post("/", authenticateRoles("Administrador"), insertScheduleValidations, validationErrors, createSchedule);

// Rutas para actualizar un horario
router.put("/:id", authenticateRoles("Administrador"), updateScheduleValidations, validationErrors, updateSchedule);

// Ruta para eliminar un horario
router.delete("/:id", authenticateRoles("Administrador"), deleteSchedule);

export default router;