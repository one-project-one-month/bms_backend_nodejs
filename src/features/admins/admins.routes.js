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
import auth from "../../middlewares/auth.js";

const router = express.Router();

router.post("/login", validationForLogin(), adminController.login);
router.get("/", auth, adminController.findAllAdmin);
router.post("/", auth, createAdminValidation(), adminController.createAdmin);
router.post(
  "/transactions",
  auth,
  body("adminCode").notEmpty().withMessage("Admin code is required."),
  adminController.transactionsForAdmin
);

router.post(
  "/actions",
  auth,
  body("process").notEmpty().withMessage("Process name required."),
  adminActionsValidation(),
  adminController.adminActions
);

router.post(
  "/users",
  auth,
  body("adminCode").notEmpty().withMessage("Admin code is required."),
  adminController.getUserByAdminCode
);

router.post(
  "/users/transactions",
  auth,
  body("process").notEmpty().withMessage("Process name is required."),
  transactionValidation,
  adminController.transactions
);

router.post(
  "/users/registrations",
  auth,
  validationForUserRegistration(),
  adminController.userRegistration
);

export default router;
