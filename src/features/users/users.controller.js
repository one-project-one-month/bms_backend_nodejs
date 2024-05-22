import userServices from "./users.service.js";

const findAllUsers = async (req, res) => {
  return res.status(200).json(await userServices.findAll());
};

const findUserById = async (req, res) => {
  const id = req.params["id"];
  return res.status(200).json(await userServices.findById(id));
};

const createUser = async (req, res) => {
  const { name, email, password, stateCode, townshipCode, adminId } = req.body;
  return res
    .status(201)
    .json(
      await userServices.create(
        name,
        email,
        password,
        stateCode,
        townshipCode,
        adminId
      )
    );
};

const updateUser = async (req, res) => {
  const id = req.params["id"];
  const updatedUser = req.body;
  return res.status(200).json(await userServices.update(id, updatedUser));
};

const deactivateUser = async (req, res) => {
  const id = req.params["id"];
  return res.status(200).json(await userServices.deactivate(id));
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
  return res.status(200).json(await userServices.remove(id));
};

export default {
  findAllUsers,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
  userActions,
};
