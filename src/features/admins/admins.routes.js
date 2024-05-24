import express from "express";
import adminController from "./admins.controller.js";
import {
  adminActionValidation,
  transactionValidation,
} from "./admins.validation.js";
import { body } from "express-validator";

const router = express.Router();

// router.get("/:id", adminController.findAdminById);
router.get("/", adminController.findAllAdmin);
router.post("/", adminController.createAdmin);
router.post("/actions", adminActionValidation(), adminController.adminActions);
router.post(
  "/transactions",
  body("process").notEmpty(),
  transactionValidation,
  adminController.transactions
);

export default router;
