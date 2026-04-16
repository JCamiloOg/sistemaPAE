import { Router } from "express";
import { createCourse, deleteCourse, getCourses, updateCourse } from "../controllers/courses.controller.js";
import { insertCourseValidations, updateCourseValidations } from "../middlewares/validations/courses.validations.js";
import { validationErrors } from "../middlewares/validations/validationErrors.js";

const router = Router();

router.get("/", getCourses);
router.get("/:id", getCourses);

router.post("/", insertCourseValidations, validationErrors, createCourse);

router.put("/:id", updateCourseValidations, validationErrors, updateCourse);

router.delete("/:id", deleteCourse);

export default router;