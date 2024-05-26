import db from "../../database/index.js";

async function createTransferTransaction(data) {
  return db.transfer.create({
    data,
    select: {
      id: true,
      amount: true,
      time: true,
      sender: {
        select: {
          name: true,
        },
      },
      receiver: {
        select: {
          name: true,
        },
      },
    },
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
