import { matchedData, validationResult } from "express-validator";
import httpStatus from "http-status-codes";
import transactionServices from "./transactions.service.js";
import { exceptionHandler } from "../../handlers/exception.js";
import { apiRes } from "../../response/response.js";

const resp = apiRes("transactions", "Transaction");

const getAllTransactions = async (req, res) => {
  const transactions = await exceptionHandler(transactionServices.getAll)();
  if (transactions instanceof Error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "something went wrong!!!" });
  }
  return res.status(httpStatus.OK).json(resp.collection(transactions));
};

const createTransaction = async (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const data = matchedData(req);
    const transaction = await exceptionHandler(transactionServices.create)(
      data
    );
    if (transaction instanceof Error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
    }
    return res.status(httpStatus.OK).json(resp.one(transaction));
  }
  return res.status(httpStatus.BAD_REQUEST).json({ errors: result.array() });
};

export default {
  getAllTransactions,
  createTransaction,
};
