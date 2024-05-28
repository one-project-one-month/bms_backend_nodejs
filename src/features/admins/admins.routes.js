import express from "express";
import adminController from "./admins.controller.js";
import {
  adminActionsValidation,
  createAdminValidation,
  transactionValidation,
  validationForLogin,
  validationForUserRegistration,
} from "./admins.validation.js";
import { body } from "express-validator";

const router = express.Router();

// router.get("/:id", adminController.findAdminById);
router.get("/", adminController.findAllAdmin);
router.post("/", createAdminValidation(), adminController.createAdmin);
router.post(
  "/transactions",
  body("adminCode").notEmpty().withMessage("Admin code is required."),
  adminController.transactionsForAdmin
);
router.post("/login", validationForLogin(), adminController.login);

router.post(
  "/actions",
  body("process").notEmpty().withMessage("Process name required."),
  adminActionsValidation(),
  adminController.adminActions
);

router.post(
  "/users/transactions",
  body("process").notEmpty().withMessage("Process name is required."),
  transactionValidation,
  adminController.transactions
);

router.post(
  "/users/registrations",
  validationForUserRegistration(),
  adminController.userRegistration
);

export default router;
