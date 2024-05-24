import services from "./transactions.service.js";

async function makeTransferTransaction({
  senderId,
  receiverId,
  amount,
  note,
  adminId,
}) {
  const transaction = await services.makeTransferTransaction({
    senderId,
    receiverId,
    amount,
    note,
    adminId,
  });
  return transaction;
}

async function makeWithdrawOrDepositTransaction({
  userId,
  amount,
  type,
  adminId,
}) {
  const transaction = await services.makeWithdrawOrDepositTransaction({
    userId,
    amount,
    type,
    adminId,
  });
  return transaction;
}

export default {
  makeTransferTransaction,
  makeWithdrawOrDepositTransaction,
};
