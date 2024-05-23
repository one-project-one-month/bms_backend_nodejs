import services from "./transactions.service.js";

const makeTransaction = async (
  senderId,
  receiverId,
  adminId,
  transferAmount,
  note = ""
) => services.create({ senderId, receiverId, adminId, transferAmount, note });

export default { makeTransaction };
