import { matchedData, validationResult } from "express-validator";
import httpStatus from "http-status-codes";
import userServices from "./users.service.js";
import {
  ADMIN_NOT_FOUND_ERR,
  USER_ALREADY_ACTIVATED,
  USER_ALREADY_DEACTIVATED,
  USER_ALREADY_DELETED,
  USER_NOT_FOUND_ERR,
} from "../../errors/errors.js";

const findAllUsers = async (req, res) => {
  let users = await userServices.findAll();
  return res.status(httpStatus.OK).json({ data: users });
};

const createUser = async (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const data = matchedData(req);
    const newUser = await userServices.create(data);

    if (newUser.error) {
      switch (newUser.error) {
        case ADMIN_NOT_FOUND_ERR:
          return res
            .status(httpStatus.BAD_REQUEST)
            .json({ message: "Admin not found." });

        default:
          return res
            .status(httpStatus.BAD_REQUEST)
            .json({ message: newUser.error });
      }
    }
    return res.status(httpStatus.CREATED).json({ data: newUser.data });
  }
  return res.status(httpStatus.BAD_REQUEST).json({ message: result.array() });
};

const updateUser = async (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const { username, data } = matchedData(req);
    const user = await userServices.update(username, data);

    if (user.error) {
      switch (user.error) {
        case USER_NOT_FOUND_ERR:
          return res
            .status(httpStatus.BAD_REQUEST)
            .json({ message: "User not found." });

        default:
          return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: user.error });
      }
    }
    return res.status(httpStatus.OK).json({ data: user.data });
  }
  return res.status(httpStatus.BAD_REQUEST).json({ message: result.array() });
};

const userActions = async (req, res) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    const { process } = matchedData(req);
    switch (process) {
      case "deactivate":
        return deactivateOrNot(req, res);
      case "activate":
        return deactivateOrNot(req, res);
      case "delete":
        return deleteUser(req, res);
      case "search":
        return findUser(req, res);
      default:
        return res
          .status(httpStatus.METHOD_NOT_ALLOWED)
          .json({ message: "Invalid process." });
    }
  }
  return res.status(httpStatus.BAD_REQUEST).json({ message: result.array() });
};

const deactivateOrNot = async (req, res) => {
  const { username, process } = matchedData(req);
  let user;
  switch (process) {
    case "deactivate":
      user = await userServices.deactivate(username);
      break;
    case "activate":
      user = await userServices.activate(username);
      break;
  }

  if (user.error) {
    switch (user.error) {
      case USER_NOT_FOUND_ERR:
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "User is not found." });
      case USER_ALREADY_ACTIVATED:
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "User is already activated." });
      case USER_ALREADY_DEACTIVATED:
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "User is already deactivated." });
      default:
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: user.error });
    }
  }
  return res.status(httpStatus.OK).json({
    data: user.data,
  });
};

const findUser = async (req, res) => {
  const { username } = matchedData(req);
  const user = await userServices.findByUsername(username);

  if (user.error) {
    switch (user.error) {
      case USER_NOT_FOUND_ERR:
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "User is not found." });

      default:
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: user.error });
    }
  }
  return res.status(httpStatus.OK).json({ data: user.data });
};

const deleteUser = async (req, res) => {
  const { username } = matchedData(req);
  const user = await userServices.remove(username);

  if (user.error) {
    switch (user.error) {
      case USER_ALREADY_DELETED:
        return res
          .status(httpStatus.BAD_GATEWAY)
          .json({ message: "User is already deleted." });

      default:
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: user.error });
    }
  }
  return res.status(httpStatus.OK).json({ data: user.data });
};

export default {
  findAllUsers,
  createUser,
  updateUser,
  deleteUser,
  userActions,
};
