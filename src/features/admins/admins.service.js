import db from "../../database/index.js";
import { generatePersonalCode } from "./admins.handler.js";
import userProtocol from "../users/users.protocols.js";
import transactionProtocol from "../transactions/transactions.protocol.js";
import { newError } from "../../errors/errors.js";

const select = {
  id: true,
  name: true,
  personalCode: true,
  role: true,
  isDeactivaed: true,
};

const findAll = async () => {
  return db.admin.findMany({
    select,
  });
};

const findByPersonalCode = async (personalCode) => {
  return db.admin.findFirstOrThrow({
    where: {
      personalCode,
    },
    select,
  });
};

const create = async (name, password, role) => {
  const personalCode = generatePersonalCode(name + new Date().toISOString());
  return db.admin.create({
    data: { name, personalCode, password, role },
  });
};

const deactivate = async (personalCode) => {
  return db.admin.update({
    where: {
      personalCode,
    },
    data: {
      isDeactivaed: true,
    },
  });
};

const transfer = async ({
  sender,
  receiver,
  adminId,
  transferAmount,
  note,
}) => {
  await userProtocol.changeBalance(
    sender.email,
    sender.balance - transferAmount
  );

  await userProtocol.changeBalance(
    receiver.email,
    receiver.balance + transferAmount
  );

  return await transactionProtocol.makeTransferTransaction({
    senderId: sender.id,
    receiverId: receiver.id,
    amount: transferAmount,
    note,
    adminId,
  });
};

const withdraw = async (email, amount, adminId) => {
  const user = await userProtocol.findUserByEmail(email);
  await userProtocol.withdraw(user, amount);
  return transactionProtocol.makeWithdrawOrDepositTransaction({
    userId: user.id,
    amount,
    type: "withdraw",
    adminId,
  });
};

const deposit = async (email, amount, adminId) => {
  const user = await userProtocol.findUserByEmail(email);
  await userProtocol.deposit(user, amount);
  return transactionProtocol.makeWithdrawOrDepositTransaction({
    userId: user.id,
    amount,
    type: "deposit",
    adminId,
  });
};

const userCreation = async (data) => {
  const user = await userProtocol.findUserByEmail(data.email);
  if (user) throw newError("UserCreatedError", "User is already created.");
  const newUser = await userProtocol.create(data);
  return newUser;
};

export default {
  findAll,
  findByPersonalCode,
  create,
  deactivate,
  transfer,
  withdraw,
  deposit,
  userCreation,
};
