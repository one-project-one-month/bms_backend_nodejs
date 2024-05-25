import { newError } from "../../errors/errors.js";
import services from "./users.service.js";

const findUserByEmail = async (email) => {
  const user = await services.findByEmail(email);
  return user;
};

const changeBalance = async (email, balance) =>
  services.update(email, { balance });

const getTransactionsByEmail = async (email) => {
  const user = await services.getTransactionsByEmail(email);
  return {
    sending: user.SendingTransferHistory,
    receiving: user.ReceivingTransferHistory,
    withdrawOrDeposit: user.WithdrawOrDeposit,
  };
};

const withdraw = async (user, amount) => {
  if (user.balance >= amount)
    return changeBalance(user.email, user.balance - amount);
  return newError("WithdrawError", "Insufficient amount");
};

const deposit = async (user, amount) => {
  return changeBalance(user.email, user.balance + amount);
};

const create = async (data) => {
  return services.create(data);
};

export default {
  findUserByEmail,
  getTransactionsByEmail,
  changeBalance,
  withdraw,
  deposit,
  create,
};
