import { Router } from "express";
import { insertUserValidations, updateUserValidations } from "../middlewares/validations/user.validations.js";
import { validationErrors } from "../middlewares/validations/validationErrors.js";
import { createUser, getUsers, updateUser } from "../controllers/users.controller.js";

const router = Router();

router.get("/", getUsers);
router.get("/:document", getUsers);
router.post("/", insertUserValidations, validationErrors, createUser);
router.put("/:document", updateUserValidations, validationErrors, updateUser);
router.put("/status/:document", createUser);


export default router;