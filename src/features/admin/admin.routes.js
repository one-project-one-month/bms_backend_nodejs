import express from "express";
import adminController from "./admin.controller.js";

const router = express.Router();

router.get("/", adminController.findAllAdmin);
router.post("/", adminController.createAdmin);
router.get("/:id", adminController.findAdminById);
router.post("/deactivate", adminController.deactivateAdmin);

export default router;
