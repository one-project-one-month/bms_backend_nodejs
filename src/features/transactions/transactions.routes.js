import express from "express";
import transactionController from "./transactions.controller.js";
import { createTransactionValidation } from "./transactions.validation.js";

const router = express.Router();

router.get("/", transactionController.getAllTransactions);
router.post(
  "/",
  createTransactionValidation(),
  transactionController.createTransaction
);

export default router;
