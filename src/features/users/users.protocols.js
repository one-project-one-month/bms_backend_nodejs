import { newError } from "../../errors/errors.js";
import services from "./users.service.js";

const findUserByEmail = async (email) => {
  try {
    const user = await services.findByEmail(email);
    return user;
  } catch (error) {
    return newError(error.name, error.message);
  }
};

const changeBalance = async (email, balance) =>
  services.update(email, { balance });

const getTransactionsByEmail = async (email) => {
  const user = await services.getTransactionsByEmail(email);
  return {
    sending: user.SendingTransferHistory,
    receiving: user.ReceivingTransferHistory,
  };
};

const withdraw = async (email, amount) => {
  const user = await services.findByEmail(email);
  console.info("withdraw ", user.balance, amount);
  if (user.balance >= amount)
    return changeBalance(email, user.balance - amount);
  return newError("WithdrawError", "Insufficient amount");
};

export default {
  findUserByEmail,
  getTransactionsByEmail,
  changeBalance,
  withdraw,
};
