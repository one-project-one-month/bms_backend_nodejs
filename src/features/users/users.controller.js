import { matchedData, validationResult } from "express-validator";
import httpStatus from "http-status-codes";
import userServices from "./users.service.js";
import { exceptionHandler } from "../../handlers/exception.js";
import { apiRes } from "../../response/response.js";

const resp = apiRes("users", "User");

const findAllUsers = async (req, res) => {
  const email = req.query["email"];
  if (email) {
    const user = await exceptionHandler(userServices.findByEmail)(email);
    if (user instanceof Error) {
      switch (user.message) {
        case "NotFoundError":
          return res
            .status(httpStatus.BAD_REQUEST)
            .json({ message: `not found user with email: ${email}` });
        default:
          return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "something went wrong!!!!" });
      }
    }
    return res.status(httpStatus.OK).json(resp.one(user));
  }
  let users = await userServices.findAll();
  users = users.map((user) => resp.one(user));
  return res.status(httpStatus.OK).json(resp.collection(users));
};

const findUserById = async (req, res) => {
  const id = req.params["id"];
  const data = await exceptionHandler(userServices.findById)(id);
  if (data instanceof Error) {
    switch (data.message) {
      case "NotFoundError":
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: `not found user with id ${id}` });
      default:
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "something went wrong!!!!" });
    }
  }
  return res.status(httpStatus.OK).json(data);
};

const createUser = async (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const data = matchedData(req);
    console.info("data in user creation ", data);
    const newUser = await exceptionHandler(userServices.create)(data);
    if (newUser instanceof Error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: newUser.message });
    }
    return res.status(httpStatus.OK).json(resp.one(newUser));
  }
  return res.status(httpStatus.BAD_REQUEST).json({ message: result.array() });
};

const updateUser = async (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const id = req.params["id"];
    const data = matchedData(req.body);
    const updatedUser = await exceptionHandler(userServices.update)(id, data);
    if (updateUser instanceof Error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: updateUser.message });
    }
    return res.status(httpStatus.OK).json(resp.one(updatedUser));
  }
  return res.status(httpStatus.BAD_REQUEST).json({ errors: result.array() });
};

const deactivateUser = async (req, res) => {
  const id = req.params["id"];
  const deactivatedUser = await exceptionHandler(userServices.deactivate)(id);
  if (deactivatedUser instanceof Error)
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: deactivatedUser.message });
  return res.status(httpStatus.OK).json(resp.one(deactivatedUser));
};

const userActions = async (req, res) => {
  const { type } = req.body;
  switch (type) {
    case "deactivate":
      return deactivateUser(req, res);
    default:
      return res
        .status(httpStatus.METHOD_NOT_ALLOWED)
        .json({ message: "Invalid action type" });
  }
};

const deleteUser = async (req, res) => {
  const id = req.params["id"];
  const deletedUser = await exceptionHandler(userServices.remove)(id);
  if (deletedUser instanceof Error)
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: deletedUser.message });
  return res.status(httpStatus.ACCEPTED).end();
};

export default {
  findAllUsers,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
  userActions,
};
