import db from "../../database/index.js";
import { newError } from "../../errors/errors.js";

const findAll = async () => {
  return db.user.findMany({});
};

const findByEmail = async (email) => {
  return db.user.findUnique({
    where: { email },
  });
};

const create = async (data) => {
  return db.user.create({
    data,
  });
};

const update = async (email, data) => {
  return db.user.update({
    where: { email },
    data,
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
      WithdrawOrDeposit: {
        select: {
          id: true,
          amount: true,
          time: true,
          type: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      SendingTransferHistory: {
        select: {
          id: true,
          amount: true,
          time: true,
          receiver: {
            select: {
              name: true,
            },
          },
        },
      },
      ReceivingTransferHistory: {
        select: {
          id: true,
          amount: true,
          time: true,
          sender: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
};

export default {
  findAll,
  findByEmail,
  create,
  update,
  deactivate,
  activate,
  remove,
  getTransactionsByEmail,
};
