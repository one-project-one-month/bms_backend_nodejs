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
  const transactions = await services.getTransactionsByEmail(email);
  return transactions;
};

export default {
  findUserByEmail,
  changeBalance,
  getTransactionsByEmail,
};
