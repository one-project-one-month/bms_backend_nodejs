import db from "../../database/index.js";
import { newError } from "../../errors/errors.js";

const select = {
  id: true,
  name: true,
  email: true,
  balance: true,
  isDeleted: true,
  stateCode: true,
  townshipCode: true,
  isDeactivated: true,
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

const create = async (data) => {
  return db.user.create({
    data,
    select: select,
  });
};

const update = async (email, data) => {
  return db.user.update({
    where: { email },
    data,
    select: select,
  });
};

const deactivate = async (email) => {
  const user = await findByEmail(email);
  if (user.isDeactivated) {
    return newError("DeactivationError", "User is already deactivated.");
  }
  return db.user.update({
    where: { email },
    data: {
      isDeactivated: true,
    },
  });
};

const activate = async (email) => {
  const user = await findByEmail(email);
  if (!user.isDeactivated) {
    return newError("ActivationError", "User is already activated.");
  }
  return db.user.update({
    where: { email },
    data: {
      isDeactivated: false,
      isDeleted: false,
    },
  });
};

const remove = async (email) => {
  return db.user.update({
    where: { email },
    data: {
      isDeleted: true,
      isDeactivated: true,
    },
  });
};

const getTransactionsByEmail = async (email) => {
  return db.user.findFirstOrThrow({
    where: { email },
    include: {
      SendingTransferHistory: true,
      ReceivingTransferHistory: true,
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
  activate,
  remove,
  getTransactionsByEmail,
};
