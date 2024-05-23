import express from "express";
import usersController from "./users.controller.js";
import {
  createUserValidation,
  updateUserValidation,
  userActionsValidation,
} from "./users.validate.js";

const router = express.Router();

router.get("/", usersController.findAllUsers);
router.get("/:id", usersController.findUserById);
router.post("/", createUserValidation(), usersController.createUser);
router.put("/", updateUserValidation(), usersController.updateUser);
router.post("/actions", userActionsValidation(), usersController.userActions);

export default router;
