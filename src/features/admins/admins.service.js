import db from "../../database/index.js";
import { generatePersonalCode } from "./admins.handler.js";
import userProtocol from "../users/users.protocols.js";
import transactionProtocol from "../transactions/transactions.protocol.js";

const findAll = async () => {
  return db.admin.findMany();
};

const findById = async (id) => {
  return db.admin.findFirstOrThrow({
    where: {
      id,
    },
  });
};

const findByPersonalCode = async (personalCode) => {
  return db.admin.findFirstOrThrow({
    where: {
      personalCode,
    },
  });
};

const create = async (name, password, role) => {
  const personalCode = generatePersonalCode(name + new Date().toISOString());
  return db.admin.create({
    data: { name, personalCode, password, role },
  });
};

const deactivate = async (id) => {
  return db.admin.update({
    where: {
      id,
    },
    data: {
      isDeactivaed: true,
    },
  });
};

const transfer = async ({
  sender,
  receiver,
  adminId,
  transferAmount,
  note,
}) => {
  await userProtocol.changeBalance(sender.id, sender.balance - transferAmount);

  await userProtocol.changeBalance(
    receiver.id,
    receiver.balance + transferAmount
  );

  return await transactionProtocol.makeTransaction(
    sender.id,
    receiver.id,
    adminId,
    transferAmount,
    note
  );
};

export default {
  findAll,
  findById,
  findByPersonalCode,
  create,
  deactivate,
  transfer,
};
