import { Router } from "express";
import { insertValidate } from "../middlewares/validations/user.validations.js";
import { validationErrors } from "../middlewares/validations/validationErrors.js";
import { createUser, getUsers, updateUser } from "../controllers/users.controller.js";

const router = Router();

router.get("/", getUsers);
router.get("/:document", getUsers);
router.post("/", insertValidate, validationErrors, createUser);
router.put("/:document", updateUser, validationErrors, createUser);
router.put("/status/:document", createUser);


export default router;