import db from "../../database/index.js";
import newError, {
  INTERNAL_ERR,
  USER_ACTIVATION_ERR,
  USER_DEACTIVATION_ERR,
  USER_NOT_FOUND_ERR,
} from "../../errors/errors.js";

const findAll = async () => {
  return db.user.findMany({});
};

const findByUsername = async (username) => {
  try {
    const user = await db.user.findUniqueOrThrow({
      where: { username },
    });
    if (!user) {
      return newError(USER_NOT_FOUND_ERR, `Username ${username} is not found.`);
    }
    return user;
  } catch (error) {
    return newError(INTERNAL_ERR, error.message);
  }
};

const create = async (data) => {
  const user = await db.user.create({
    data,
  });
  if (!user) {
    return newError(INTERNAL_ERR, "");
  }
  return user;
};

const update = async (username, data) => {
  try {
    const user = await db.user.update({
      where: { username },
      data,
    });
    if (!user) {
      return newError(USER_NOT_FOUND_ERR, `Username ${username} is not found.`);
    }
    return user;
  } catch (error) {
    return newError(INTERNAL_ERR, error.message);
  }
};

const deactivate = async (username) => {
  const user = await findByUsername(username);
  if (user) {
    if (user.isDeactivated) {
      return newError(USER_DEACTIVATION_ERR, "User is already deactivated.");
    }
    return db.user.update({
      where: { username },
      data: {
        isDeactivated: true,
      },
    });
  }
  return newError(USER_NOT_FOUND_ERR, `Username ${username} is not found.`);
};

const activate = async (username) => {
  const user = await findByUsername(username);
  if (user) {
    if (user.isDeactivated) {
      return newError(USER_ACTIVATION_ERR, "User is already activated.");
    }
    return db.user.update({
      where: { username },
      data: {
        isDeactivated: false,
        isDeleted: false,
      },
    });
  }
  return newError(USER_NOT_FOUND_ERR, `Username ${username} is not found.`);
};

const remove = async (username) => {
  try {
    const user = await db.user.update({
      where: { username },
      data: {
        isDeleted: true,
        isDeactivated: true,
      },
    });
    if (!user) {
      return newError(USER_NOT_FOUND_ERR, `Username ${username} is not found.`);
    }
    return user;
  } catch (error) {
    return newError(INTERNAL_ERR, error.message);
  }
};

const getTransactions = async (username) => {
  const transactions = await db.user.findUnique({
    where: { username },
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
  if (!transactions)
    return newError(USER_NOT_FOUND_ERR, `Username ${username} is not found.`);
  return transactions;
};

export default {
  findAll,
  findByUsername,
  create,
  update,
  deactivate,
  activate,
  remove,
  getTransactions,
};
