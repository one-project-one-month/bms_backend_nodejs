import { matchedData, validationResult } from "express-validator";
import httpStatus from "http-status-codes";
import userServices from "./users.service.js";
import { exceptionHandler } from "../../handlers/exception.js";

const findAllUsers = async (req, res) => {
  let users = await exceptionHandler(userServices.findAll)();
  if (users.isError) return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
  return res.status(httpStatus.OK).json({ data: users });
};

const findUserByEmail = async (req, res) => {
  const { email } = matchedData(req);
  const user = await userServices.findByEmail(email);
  if (!user) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: `User not found with email ${email}` });
  }
  return res.status(httpStatus.OK).json({ data: user });
};

const createUser = async (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const data = matchedData(req);
    const newUser = await exceptionHandler(userServices.create)(data);
    if (newUser.isError) {
      switch (newUser.name) {
        case "PrismaClientKnownRequestError":
          return res
            .status(httpStatus.BAD_REQUEST)
            .json({ message: "Admin id is wrong" });
        default:
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
      }
    }
    return res.status(httpStatus.CREATED).json({ data: newUser });
  }
  return res.status(httpStatus.BAD_REQUEST).json({ message: result.array() });
};

const updateUser = async (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const { email, data } = matchedData(req);
    const updatedUser = await exceptionHandler(userServices.update)(
      email,
      data
    );
    if (updatedUser.isError) {
      switch (updatedUser.name) {
        case "PrismaClientKnownRequestError":
          return res
            .status(httpStatus.BAD_REQUEST)
            .json({ message: `User not found with email ${email}` });

        default:
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
      }
    }
    return res.status(httpStatus.OK).json({ data: updatedUser });
  }
  return res.status(httpStatus.BAD_REQUEST).json({ message: result.array() });
};

const deactivateUser = async (req, res) => {
  const { email } = matchedData(req);
  const deactivatedUser = await exceptionHandler(userServices.deactivate)(
    email
  );
  if (deactivatedUser.isError) {
    switch (deactivatedUser.name) {
      case "NotFoundError":
      case "DeactivationError":
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: deactivatedUser.message });
      default:
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
    }
  }
  return res.status(httpStatus.OK).end();
};

const activateUser = async (req, res) => {
  const { email } = matchedData(req);
  const activatedUser = await exceptionHandler(userServices.activate)(email);
  if (activatedUser.isError) {
    switch (activatedUser.name) {
      case "NotFoundError":
      case "ActivationError":
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: activatedUser.message });
      default:
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
    }
  }
  return res.status(httpStatus.OK).end();
};

const userActions = async (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const { process } = matchedData(req);
    switch (process) {
      case "deactivate":
        return deactivateUser(req, res);
      case "activate":
        return activateUser(req, res);
      case "delete":
        return deleteUser(req, res);
      case "search":
        return findUserByEmail(req, res);
      default:
        return res
          .status(httpStatus.METHOD_NOT_ALLOWED)
          .json({ message: "Invalid process." });
    }
  }
  return res.status(httpStatus.BAD_REQUEST).json({ message: result.array() });
};

const deleteUser = async (req, res) => {
  const { email } = matchedData(req);
  const deletedUser = await exceptionHandler(userServices.remove)(email);
  if (deletedUser.isError) {
    switch (deletedUser.name) {
      case "PrismaClientKnownRequestError":
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "User not found" });
      default:
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
    }
  }
  return res.status(httpStatus.OK).end();
};

export default {
  findAllUsers,
  createUser,
  updateUser,
  deleteUser,
  userActions,
};
