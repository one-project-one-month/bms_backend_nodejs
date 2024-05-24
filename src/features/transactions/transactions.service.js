import db from "../../database/index.js";

async function createTransferTransaction(data) {
  return db.transfer.create({
    data,
  });
}

async function createWithdrawOrDepositTransaction(data) {
  return db.withdrawOrDeposit.create({
    data,
  });
}

export default {
  createTransferTransaction,
  createWithdrawOrDepositTransaction,
};
