import db from "../../database/index.js";

const findAll = async () => {
  return db.user.findMany();
};

const findById = async (id) => {
  return db.user.findFirstOrThrow({ where: { id } });
};

const create = async (
  name,
  email,
  password,
  stateCode,
  townshipCode,
  adminId
) => {
  return db.user.create({
    data: { name, email, password, stateCode, townshipCode, adminId },
  });
};

const update = async (id, updatedUser) => {
  return db.user.update({
    where: { id },
    data: updatedUser,
  });
};

const deactivate = async (id) => {
  return db.user.update({
    where: { id },
    data: { isDeactivated: true },
  });
};

const remove = async (id) => {
  return db.user.update({
    where: { id },
    data: { isDeleted: true },
  });
};

export default {
  findAll,
  findById,
  create,
  update,
  deactivate,
  remove,
};
