import userServices from "./users.service.js";
import { exceptionHandler } from "../../handlers/exception.js";
import { apiRes } from "../../response/response.js";
import usersService from "./users.service.js";

const resp = apiRes("users", "User");

const findAllUsers = async (req, res) => {
  const email = req.query["email"];
  if (email) {
    const user = await exceptionHandler(userServices.findByEmail)(email);
    if (user instanceof Error) {
      switch (data.message) {
        case "NotFoundError":
          return res
            .status(400)
            .json({ message: `not found user with id ${id}` });
        default:
          return res.status(500).json({ message: "something went wrong!!!!" });
      }
    }
    return res.status(200).json(resp.one(user));
  }
  let users = await userServices.findAll();
  users = users.map((user) => resp.one(user));
  return res.status(200).json(resp.collection(users));
};

const findUserById = async (req, res) => {
  const id = req.params["id"];
  const data = await exceptionHandler(userServices.findById)(id);
  if (data instanceof Error) {
    switch (data.message) {
      case "NotFoundError":
        return res
          .status(400)
          .json({ message: `not found user with id ${id}` });
      default:
        return res.status(500).json({ message: "something went wrong!!!!" });
    }
  }
  return res.status(200).json(data);
};

const createUser = async (req, res) => {
  const newUser = await exceptionHandler(userServices.create)(req.body);
  if (newUser instanceof Error) {
    return res.status(500).json({ message: newUser.message });
  }
  return res.status(201).json(resp.one(newUser));
};

const updateUser = async (req, res) => {
  const id = req.params["id"];
  const updatedUser = await exceptionHandler(userServices.update)(id, req.body);
  if (updateUser instanceof Error) {
    return res.status(500).json({ message: updateUser.message });
  }
  return res.status(200).json(resp.one(updatedUser));
};

const deactivateUser = async (req, res) => {
  const id = req.params["id"];
  const deactivatedUser = await exceptionHandler(userServices.deactivate)(id);
  if (deactivatedUser instanceof Error)
    return res.status(500).json({ message: deactivatedUser.message });
  return res.status(200).json(resp.one(deactivatedUser));
};

const userActions = async (req, res) => {
  const { type } = req.body;
  switch (type) {
    case "deactivate":
      return deactivateUser(req, res);
  }
};

const deleteUser = async (req, res) => {
  const id = req.params["id"];
  const deletedUser = await exceptionHandler(userServices.remove)(id);
  if (deletedUser instanceof Error)
    return res.status(500).json({ message: deletedUser.message });
  return res.status(200).json(resp.one(deletedUser));
};

export default {
  findAllUsers,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
  userActions,
};
