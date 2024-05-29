import db from "../../database/index.js";

async function getAllTransactions() {
  const transfers = await db.transfer.findMany({
    select: {
      id: true,
      amount: true,
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
      note: true,
      time: true,
      admin: {
        select: {
          name: true,
          adminCode: true,
        },
      },
    },
  });
  const withdrawOrDeposits = await db.withdrawOrDeposit.findMany({
    select: {
      id: true,
      amount: true,
      user: {
        select: {
          name: true,
        },
      },
      time: true,
      type: true,
    },
  });

  return {
    transfers,
    withdrawOrDeposits,
  };
}

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
  getAllTransactions,
  createTransferTransaction,
  createWithdrawOrDepositTransaction,
};
