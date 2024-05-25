import httpStatus from "http-status-codes";
import { matchedData, validationResult } from "express-validator";
import adminService from "./admins.service.js";
import { exceptionHandler } from "../../handlers/exception.js";
import userProtocol from "../users/users.protocols.js";

const findAllAdmin = async (req, res) => {
  let admins = await exceptionHandler(adminService.findAll)();
  if (admins.isError) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
  }
  return res.status(httpStatus.OK).json({ data: admins });
};

const findAdminByCode = async (req, res) => {
  const { data } = matchedData(req);
  const admin = await exceptionHandler(adminService.findByPersonalCode)(
    data.adminCode
  );
  if (admin.isError) {
    switch (admin.message) {
      case "No Admin found":
        return res.status(httpStatus.BAD_REQUEST).json({
          message: `not found admin with personal code: ${data.adminCode}`,
        });
      default:
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
    }
  }
  return res.status(httpStatus.OK).json({ data: admin });
};

const createAdmin = async (req, res) => {
  const { name, password, role } = req.body;
  const admin = await adminService.create(name, password, role);
  if (!admin) return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
  return res.status(201).json({ data: admin });
};

const deactivateAdmin = async (req, res) => {
  const { data } = matchedData(req);
  const admin = await exceptionHandler(adminService.deactivate)(data.adminCode);
  if (admin.isError) {
    console.error("admin error ", admin.name);
    switch (admin.name) {
      case "PrismaClientKnownRequestError":
      case "PrismaClientValidationError":
        return res.status(httpStatus.BAD_REQUEST).json({
          message: `Admin not found with personal code ${data.adminCode}`,
        });
      default:
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
    }
  }
  return res.status(200).end();
};

const adminActions = async (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const { process } = matchedData(req);
    switch (process) {
      case "deactivate":
        return deactivateAdmin(req, res);
      case "search":
        return findAdminByCode(req, res);
      default:
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "Invalid action name" });
    }
  }
  return res.status(httpStatus.BAD_REQUEST).json({ message: result.array() });
};

const transfer = async (req, res) => {
  const { adminId, data } = matchedData(req);
  const { senderEmail, receiverEmail, transferAmount, note } = data;

  if (!senderEmail) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Sender email must be not empty." });
  }

  if (!receiverEmail) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Receiver email must be not empty." });
  }

  if (senderEmail === receiverEmail)
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Sender email and receiver email must not be same." });

  const sender = await userProtocol.findUserByEmail(senderEmail);
  if (sender.isError) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: `user not found with email: ${senderEmail}` });
  }

  const receiver = await userProtocol.findUserByEmail(receiverEmail);
  if (receiver.isError) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: `user not found with email: ${receiverEmail}` });
  }

  if (sender.balance < transferAmount) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "Sender's balance must be greater than transfer amount.",
    });
  }

  const transaction = await exceptionHandler(adminService.transfer)({
    sender,
    receiver,
    adminId,
    transferAmount,
    note,
  });

  if (transaction.isError) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
  }

  return res.status(httpStatus.OK).end();
};

const listTransactionsByUserEmail = async (req, res) => {
  const { data } = matchedData(req);
  const transactions = await exceptionHandler(
    userProtocol.getTransactionsByEmail
  )(data.userEmail);

  if (transactions.isError) {
    console.log("error in transaction ", transactions);
    switch (transactions.name) {
      case "PrismaClientValidationError":
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: `User not found with email ${data.userEmail}` });
      default:
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
    }
  }
  return res.status(httpStatus.OK).json({ data: transactions });
};

const withdraw = async (req, res) => {
  const { adminId, data } = matchedData(req);
  const user = await exceptionHandler(adminService.withdraw)(
    data.userEmail,
    data.amount,
    adminId
  );
  console.info("user in withdraw", user);
  if (user.isError) {
    switch (user.name) {
      case "PrismaClientValidationError":
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: `User not found with email ${data.userEmail}` });
      case "PrismaClientKnownRequestError":
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: `Admin not found with id ${adminId}` });
      case "WithdrawError":
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: user.message });

      default:
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
    }
  }

  return res.status(httpStatus.OK).end();
};

const transactions = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: result.array() });
  }
  const { process } = matchedData(req);
  switch (process) {
    case "transfer":
      return transfer(req, res);
    case "withdraw":
      return withdraw(req, res);
    case "list":
      return listTransactionsByUserEmail(req, res);
    default:
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Invalid transfer type name" });
  }
};

export default {
  findAllAdmin,
  createAdmin,
  adminActions,
  transactions,
};
