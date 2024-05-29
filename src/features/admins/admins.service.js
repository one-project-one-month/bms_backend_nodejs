import db from "../../database/index.js";
import {
  checkPassword,
  generatePersonalCode,
  generateToken,
  hashPassword,
} from "./admins.handler.js";
import userProtocol from "../users/users.protocols.js";
import transactionProtocol from "../transactions/transactions.protocol.js";
import {
  ACCESS_DENIED_ERR,
  ADMIN_NOT_FOUND_ERR,
  ALREADY_ACTIVATED_ERR,
  DEPOSIT_ERR,
  INSUFFICIENT_AMOUNT_ERR,
  INTERNAL_ERR,
  RECEIVER_NOT_FOUND_ERR,
  SAME_USER_ERR,
  SENDER_NOT_FOUND_ERR,
  USER_ALREADY_CREATED,
  USER_NOT_FOUND_ERR,
  WITHDRAW_ERR,
} from "../../errors/errors.js";

const select = {
  id: true,
  name: true,
  adminCode: true,
  role: true,
  isDeactivated: true,
};

const findAll = async () => {
  return db.admin.findMany({
    select,
  });
};

const findByAdminCode = async (adminCode, password = false) => {
  try {
    const admin = await db.admin.findFirstOrThrow({
      where: {
        adminCode,
      },
      select: {
        ...select,
        password,
      },
    });
    return {
      data: admin,
      error: null,
    };
  } catch (error) {
    console.info(error);
    return {
      data: null,
      error: ADMIN_NOT_FOUND_ERR,
    };
  }
};

// const findByAdminId = async (id) => {
//   try {
//     const admin = await db.admin.findFirstOrThrow({
//       where: {
//         id,
//       },
//       select,
//     });
//     return {
//       data: admin,
//       error: null,
//     };
//   } catch (error) {
//     console.info(error);
//     return {
//       data: null,
//       error: ADMIN_NOT_FOUND_ERR,
//     };
//   }
// };

const create = async (data) => {
  const adminCode = generatePersonalCode(data.name);
  try {
    const password = await hashPassword(data.password);
    data.password = password;
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: INTERNAL_ERR,
    };
  }
  const admin = await db.admin.create({
    data: { ...data, adminCode },
    select,
  });
  return {
    data: admin,
    error: null,
  };
};

const deactivate = async (adminCode) => {
  const admin = await db.admin.update({
    where: {
      adminCode,
    },
    data: {
      isDeactivated: true,
    },
    select,
  });
  return {
    data: admin,
    error: null,
  };
};

const transfer = async ({
  senderUsername,
  receiverUsername,
  transferAmount,
  note,
  adminCode,
}) => {
  if (senderUsername === receiverUsername)
    return { data: null, error: SAME_USER_ERR };

  const { data } = await findByAdminCode(adminCode);

  const sender = await userProtocol.findUserByUsername(senderUsername);
  if (!sender) return { data: null, error: SENDER_NOT_FOUND_ERR };

  if (sender.isDeactivated || sender.isDeleted)
    return { data: null, error: ACCESS_DENIED_ERR };

  const receiver = await userProtocol.findUserByUsername(receiverUsername);
  if (!receiver) return { data: null, error: RECEIVER_NOT_FOUND_ERR };

  if (sender.balance < transferAmount)
    return { data: null, error: INSUFFICIENT_AMOUNT_ERR };

  try {
    await userProtocol.changeBalance(
      sender.username,
      sender.balance - transferAmount
    );

    await userProtocol.changeBalance(
      receiver.username,
      receiver.balance + transferAmount
    );

    const transaction = await transactionProtocol.makeTransferTransaction({
      senderId: sender.id,
      receiverId: receiver.id,
      amount: transferAmount,
      note,
      adminId: data.id,
    });

    if (!transaction) {
      return {
        data: null,
        error: INTERNAL_ERR,
      };
    }

    return {
      data: transaction,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error,
    };
  }
};

const withdraw = async (username, amount, adminCode) => {
  const { data } = await findByAdminCode(adminCode);

  let user = await userProtocol.findUserByUsername(username);
  if (!user) return { data: null, error: USER_NOT_FOUND_ERR };

  if (user.isDeactivated || user.isDeleted)
    return { data: null, error: ACCESS_DENIED_ERR };

  if (user.balance < amount)
    return { data: null, error: INSUFFICIENT_AMOUNT_ERR };

  user = await userProtocol.withdraw(user.username, user.balance, amount);
  if (!user) return { data: null, error: WITHDRAW_ERR };

  const transaction =
    await transactionProtocol.makeWithdrawOrDepositTransaction({
      userId: user.id,
      amount,
      type: "withdraw",
      adminId: data.id,
    });
  return { data: transaction, error: null };
};

const deposit = async (username, amount, adminCode) => {
  const { data } = await findByAdminCode(adminCode);

  let user = await userProtocol.findUserByUsername(username);
  if (!user) return { data: null, error: USER_NOT_FOUND_ERR };

  if (user.isDeactivated || user.isDeleted)
    return { data: null, error: ACCESS_DENIED_ERR };

  user = await userProtocol.deposit(user.username, user.balance, amount);
  if (!user) return { data: null, error: DEPOSIT_ERR };

  const transaction =
    await transactionProtocol.makeWithdrawOrDepositTransaction({
      userId: user.id,
      amount,
      type: "deposit",
      adminId: data.id,
    });
  return { data: transaction, error: null };
};

const findUser = async (username) => userProtocol.findUserByUsername(username);

const userRegistration = async (userData) => {
  const user = await userProtocol.findUserByEmail(userData.email);
  if (user) {
    return {
      data: user,
      error: USER_ALREADY_CREATED,
    };
  }

  const { data } = await findByAdminCode(userData.adminCode);

  delete userData.adminCode;
  return userProtocol.create({ ...userData, adminId: data.id });
};

const getTransactions = async (username) => {
  const transactions = await userProtocol.getTransactions(username);
  if (!transactions)
    return {
      data: null,
      error: INTERNAL_ERR,
    };
  return {
    data: transactions,
    error: null,
  };
};

const login = async (adminCode, password) => {
  const { data, error } = await findByAdminCode(adminCode, true);
  if (error) return { data, error };

  const isPassword = await checkPassword(password, data.password);
  if (!isPassword) {
    return {
      data: null,
      error: ACCESS_DENIED_ERR,
    };
  }
  const token = generateToken({ adminCode, role: data.role });
  return {
    data: token,
    error: null,
  };
};

const getTransactionsForAdmin = async (adminCode) => {
  const transactions = await db.admin.findUnique({
    where: {
      adminCode,
    },
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
      Transfer: {
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
};

const activate = async (adminCode) => {
  const { data } = await findByAdminCode(adminCode);

  if (!data.isDeactivated) return { data: null, error: ALREADY_ACTIVATED_ERR };

  const admin = await db.admin.update({
    where: {
      adminCode: adminCode,
    },
    data: {
      isDeactivated: false,
    },
  });
  return {
    data: admin,
    error: null,
  };
};

export default {
  findAll,
  findByAdminCode,
  create,
  deactivate,
  transfer,
  withdraw,
  deposit,
  userRegistration,
  getTransactions,
  findUser,
  login,
  getTransactionsForAdmin,
  activate,
};
