import express from "express";
import usersController from "./users.controller.js";

const router = express.Router();

router.get("/", usersController.findAllUsers);
router.get("/:id", usersController.findUserById);
router.post("/", usersController.createUser);
router.put("/:id", usersController.updateUser);
router.post("/:id/actions", usersController.userActions);
router.delete("/:id", usersController.deleteUser);

export default router;
