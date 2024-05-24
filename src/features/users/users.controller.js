import { matchedData, validationResult } from "express-validator";
import httpStatus from "http-status-codes";
import userServices from "./users.service.js";
import { exceptionHandler } from "../../handlers/exception.js";
import { apiRes } from "../../response/response.js";

const resp = apiRes("users", "User");

const findAllUsers = async (req, res) => {
  let users = await exceptionHandler(userServices.findAll)();
  if (users instanceof Error)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
  users = users.map((user) => resp.one(user));
  return res.status(httpStatus.OK).json(resp.collection(users));
};

const findUserById = async (req, res) => {
  const id = req.params["id"];
  const data = await exceptionHandler(userServices.findById)(id);
  if (data instanceof Error) {
    console.info("data in ", data.message);
    switch (data.message) {
      case "No User found":
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: `not user found with id ${id}` });
      default:
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "something went wrong!!!!" });
    }
  }
  return res.status(httpStatus.OK).json(data);
};

const findUserByEmail = async (req, res) => {
  const { email } = matchedData(req);
  const user = await exceptionHandler(userServices.findByEmail)(email);
  if (user instanceof Error) {
    switch (user.name) {
      case "NotFoundError":
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: user.message });
      default:
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "something went wrong!!!!" });
    }
  }
  return res.status(httpStatus.OK).json(resp.one(user));
};

const createUser = async (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const data = matchedData(req);
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
    const { email, data } = matchedData(req);
    const updatedUser = await exceptionHandler(userServices.update)(
      email,
      data
    );
    if (updatedUser instanceof Error) {
      switch (updatedUser.name) {
        case "PrismaClientKnownRequestError":
          return res
            .status(httpStatus.BAD_REQUEST)
            .json({ errors: "User not found" });

        default:
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
      }
    }
    return res.status(httpStatus.OK).json(resp.one(updatedUser));
  }
  return res.status(httpStatus.BAD_REQUEST).json({ errors: result.array() });
};

const deactivateUser = async (req, res) => {
  const { email } = matchedData(req);
  const deactivatedUser = await exceptionHandler(userServices.deactivate)(
    email
  );
  if (deactivatedUser instanceof Error) {
    switch (deactivatedUser.name) {
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

const userActions = async (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const { process } = matchedData(req);
    switch (process) {
      case "deactivate":
        return deactivateUser(req, res);
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
  return res.status(httpStatus.BAD_REQUEST).json({ errors: result.array() });
};

const deleteUser = async (req, res) => {
  const { email } = matchedData(req);
  const deletedUser = await exceptionHandler(userServices.remove)(email);
  if (deletedUser instanceof Error) {
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
  findUserById,
  createUser,
  updateUser,
  deleteUser,
  userActions,
};
