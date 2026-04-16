import { Router } from "express";
import { createStudent, getStudents, updateStudent } from "../controllers/students.controller.js";
import { insertStudentValidations, updateStudentValidations } from "../middlewares/validations/students.validations.js";
import { validationErrors } from "../middlewares/validations/validationErrors.js";

const router = Router();

router.get("/", getStudents);
router.get("/:document", getStudents);
router.post("/", insertStudentValidations, validationErrors, createStudent);
router.put("/:document", updateStudentValidations, validationErrors, updateStudent);
router.put("/status/:document", updateStudent);


export default router;
