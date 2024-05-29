import db from "../../database/index.js";
import {
  ADMIN_NOT_FOUND_ERR,
  USER_ALREADY_ACTIVATED,
  USER_ALREADY_DEACTIVATED,
  USER_ALREADY_DELETED,
  USER_NOT_FOUND_ERR,
} from "../../errors/errors.js";
import usersHandler from "./users.handler.js";

const findAll = async () => {
  return db.user.findMany({
    include: {
      admin: {
        select: {
          name: true,
          adminCode: true,
        },
      },
    },
  });
};

const findByUsername = async (username) => {
  try {
    const user = await db.user.findUniqueOrThrow({
      where: { username },
    });
    return {
      data: user,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: USER_NOT_FOUND_ERR,
    };
  }
};

const findByEmail = async (email) => {
  try {
    const user = await db.user.findUniqueOrThrow({
      where: { email },
    });
    return {
      data: user,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: USER_NOT_FOUND_ERR,
    };
  }
};

const create = async (data) => {
  const username = usersHandler.generateUsername(data.name);
  try {
    const user = await db.user.create({
      data: {
        ...data,
        username,
      },
    });
    return {
      data: user,
      error: null,
    };
  } catch (error) {
    console.error(error.message);
    return {
      data: null,
      error: ADMIN_NOT_FOUND_ERR,
    };
  }
};

const update = async (username, data) => {
  try {
    const user = await db.user.update({
      where: { username },
      data,
    });
    return {
      data: user,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: USER_NOT_FOUND_ERR,
    };
  }
};

const deactivate = async (username) => {
  const { data, error } = await findByUsername(username);
  if (data) {
    if (data.isDeactivated) {
      return {
        data,
        error: USER_ALREADY_DEACTIVATED,
      };
    }
    const user = await db.user.update({
      where: { username },
      data: {
        isDeactivated: true,
      },
    });
    return {
      data: user,
      error: null,
    };
  }

  return {
    data: null,
    error: error,
  };
};

const activate = async (username) => {
  const { data, error } = await findByUsername(username);

  if (data) {
    if (!data.isDeactivated) {
      return {
        data,
        error: USER_ALREADY_ACTIVATED,
      };
    }

    const user = await db.user.update({
      where: { username },
      data: {
        isDeactivated: false,
        isDeleted: false,
      },
    });
    return { data: user, error: null };
  }

  return { data: null, error };
};

const remove = async (username) => {
  const { data, error } = await findByUsername(username);

  if (data) {
    if (data.isDeactivated && data.isDeleted)
      return {
        data,
        error: USER_ALREADY_DELETED,
      };

    const user = await db.user.update({
      where: { username },
      data: {
        isDeactivated: true,
        isDeleted: true,
      },
    });

    return { data: user, error: null };
  }
  return {
    data: null,
    error,
  };
};

const getTransactions = async (username) => {
  try {
    const transactions = await db.user.findUniqueOrThrow({
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
            sender: {
              select: {
                name: true,
              },
            },
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
            receiver: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return {
      data: transactions,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: USER_NOT_FOUND_ERR,
    };
  }
};

export default {
  findAll,
  findByUsername,
  findByEmail,
  create,
  update,
  deactivate,
  activate,
  remove,
  getTransactions,
};
