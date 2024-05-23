import express from "express";
import adminController from "./admins.controller.js";
import { adminActionValidation } from "./admins.validation.js";

const router = express.Router();

router.get("/", adminController.findAllAdmin);
router.post("/", adminController.createAdmin);
// router.get("/:id", adminController.findAdminById);
router.post("/actions", adminActionValidation(), adminController.adminActions);

export default router;
