import db from "../../database/index.js";

const select = {
  id: true,
  name: true,
  email: true,
  stateCode: true,
  townshipCode: true,
};

const findAll = async () => {
  return db.user.findMany();
};

const findById = async (id) => {
  return db.user.findFirstOrThrow({
    where: { id },
    select: select,
  });
};

const findByEmail = async (email) => {
  return db.user.findUniqueOrThrow({
    where: { email },
    select: select,
  });
};

const create = async ({
  name,
  password,
  email,
  stateCode,
  townshipCode,
  adminId,
}) => {
  return db.user.create({
    data: { name, email, password, stateCode, townshipCode, adminId },
    select: select,
  });
};

const update = async (id, updatedUser) => {
  return db.user.update({
    where: { id },
    data: { ...updatedUser },
    select: {
      id: true,
      balance: true,
    },
  });
};

const deactivate = async (id) => {
  return db.user.update({
    where: { id },
    data: {
      isDeactivated: true,
    },
    select: {
      id: true,
      name: true,
      isDeactivated: true,
    },
  });
};

const remove = async (id) => {
  return db.user.update({
    where: { id },
    data: {
      isDeleted: true,
      isDeactivated: true,
    },
    select: {
      id: true,
      name: true,
      isDeactivated: true,
      isDeleted: true,
    },
  });
};

export default {
  findAll,
  findById,
  findByEmail,
  create,
  update,
  deactivate,
  remove,
};
