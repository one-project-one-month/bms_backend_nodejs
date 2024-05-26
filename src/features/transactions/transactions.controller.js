import httpStatus from "http-status-codes";
import transServices from "./transactions.service.js";

const getAllTransactions = async (req, res) => {
  const transactions = await transServices.getAllTransactions();
  return res.status(httpStatus.OK).json({
    data: [...transactions.transfers, ...transactions.withdrawOrDeposits],
  });
};

export default {
  getAllTransactions,
};
