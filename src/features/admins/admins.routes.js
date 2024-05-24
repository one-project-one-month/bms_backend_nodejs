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
router.post(
  "/actions",
  body("process").notEmpty().withMessage("Process name required."),
  adminActionValidation,
  adminController.adminActions
);
router.post(
  "/transactions",
  body("process").notEmpty().withMessage("Process name is required."),
  transactionValidation,
  adminController.transactions
);

export default router;
