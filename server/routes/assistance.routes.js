import { Router } from "express";
import { getAssistance, saveAssistance, updateAssistance } from "../controllers/assistance.controller.js";

const router = Router();


router.get("/", getAssistance);
router.post("/", saveAssistance);
router.put("/", updateAssistance);

export default router;