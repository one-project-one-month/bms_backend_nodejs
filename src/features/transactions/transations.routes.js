import express from "express";
import transController from "./transactions.controller.js";

const router = express.Router();

router.get("/", transController.getAllTransactions);

export default router;
