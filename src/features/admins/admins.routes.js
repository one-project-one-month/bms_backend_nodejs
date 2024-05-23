import express from "express";
import adminController from "./admins.controller.js";

const router = express.Router();

router.get("/", adminController.findAllAdmin);
router.post("/", adminController.createAdmin);
router.get("/:id", adminController.findAdminById);
router.post("/:id/actions", adminController.adminActions);

export default router;
