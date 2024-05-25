import express from "express";
import adminController from "./admins.controller.js";
import {
  adminActionValidation,
  transactionValidation,
  validationForUserRegistration,
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
