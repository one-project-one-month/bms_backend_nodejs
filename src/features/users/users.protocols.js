import { INSUFFICIENT_AMOUNT_ERR, newError } from "../../errors/errors.js";
import services from "./users.service.js";

const findUserByUsername = async (username) => {
  const user = await services.findByUsername(username);
  return user;
};

const changeBalance = async (username, balance) => {
  const user = await services.update(username, { balance });
  return user;
};

const getTransactions = async (username) => {
  const user = await services.getTransactions(username);
  if (user.isError()) return user;
  return {
    sending: user.SendingTransferHistory,
    receiving: user.ReceivingTransferHistory,
    withdrawOrDeposit: user.WithdrawOrDeposit,
  };
};

const withdraw = async (user, amount) => {
  if (user.balance >= amount)
    return changeBalance(user.email, user.balance - amount);
  return newError(INSUFFICIENT_AMOUNT_ERR, "Insufficient amount");
};

const deposit = async (user, amount) => {
  return changeBalance(user.email, user.balance + amount);
};

const create = async (data) => {
  return services.create(data);
};

export default {
  findUserByUsername,
  getTransactions,
  changeBalance,
  withdraw,
  deposit,
  create,
};
