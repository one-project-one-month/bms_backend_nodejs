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
  return services.getTransactionsByEmail(email);
};

export default {
  findUserByEmail,
  changeBalance,
  getTransactionsByEmail,
};