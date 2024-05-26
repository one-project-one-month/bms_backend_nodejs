import { matchedData, validationResult } from "express-validator";
import httpStatus from "http-status-codes";
import userServices from "./users.service.js";
import { INTERNAL_ERR } from "../../errors/errors.js";

const findAllUsers = async (req, res) => {
  let users = await userServices.findAll();
  return res.status(httpStatus.OK).json({ data: users });
};

const createUser = async (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const data = matchedData(req);
    const newUser = await userServices.create(data);
    if (newUser.isError()) {
      if (newUser.message === INTERNAL_ERR)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
    }
    return res.status(httpStatus.CREATED).json({ data: newUser });
  }
  return res.status(httpStatus.BAD_REQUEST).json({ message: result.array() });
};

const updateUser = async (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const { username, data } = matchedData(req);
    const updatedUser = await userServices.update(username, data);
    if (updatedUser.isError()) {
      if (updatedUser.message === INTERNAL_ERR)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: updateUser.message });
    }
    return res.status(httpStatus.OK).json({ data: updatedUser });
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
  if (user.isError()) {
    if (user.name === INTERNAL_ERR)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
    return res.status(httpStatus.BAD_REQUEST).json({ message: user.message });
  }
  return res.status(httpStatus.OK).json({
    name: user.name,
    username: user.username,
    isDeactivated: user.isDeactivated,
  });
};

const findUser = async (req, res) => {
  const { username } = matchedData(req);
  const user = await userServices.findByUsername(username);
  if (user.isError()) {
    if (user.name === INTERNAL_ERR)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
    return res.status(httpStatus.BAD_REQUEST).json({ message: user.message });
  }
  return res.status(httpStatus.OK).json({ data: user });
};

const deleteUser = async (req, res) => {
  const { username } = matchedData(req);
  const user = await userServices.remove(username);
  if (user.isError()) {
    if (user.name === INTERNAL_ERR)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
    return res.status(httpStatus.BAD_REQUEST).json({ message: user.message });
  }
  return res.status(httpStatus.OK).json({ data: user });
};

export default {
  findAllUsers,
  createUser,
  updateUser,
  deleteUser,
  userActions,
};
