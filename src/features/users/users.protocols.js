import services from "./users.service.js";

const findUserByUsername = async (username) => {
  const { data, error } = await services.findByUsername(username);
  if (error) return null;
  return data;
};

const findUserByEmail = async (email) => {
  const { data, error } = await services.findByEmail(email);
  if (error) return null;
  return data;
};

const changeBalance = async (username, balance) => {
  const { data, error } = await services.update(username, { balance });
  if (error) return null;
  return data;
};

const getTransactions = async (username) => {
  const { data, error } = await services.getTransactions(username);
  if (error) return data;
  return {
    sending: data.SendingTransferHistory,
    receiving: data.ReceivingTransferHistory,
    withdrawOrDeposit: data.WithdrawOrDeposit,
  };
};

const withdraw = async (username, balance, amount) => {
  return changeBalance(username, balance - amount);
};

const deposit = async (username, balance, amount) => {
  return changeBalance(username, balance + amount);
};

const create = async (userData) => {
  return services.create(userData);
};

export default {
  findUserByUsername,
  findUserByEmail,
  getTransactions,
  changeBalance,
  withdraw,
  deposit,
  create,
};
