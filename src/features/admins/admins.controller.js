import httpStatus from "http-status-codes";
import { matchedData, validationResult } from "express-validator";
import adminService from "./admins.service.js";
import {
  ADMIN_NOT_FOUND_ERR,
  DEPOSIT_ERR,
  RECEIVER_NOT_FOUND_ERR,
  SENDER_NOT_FOUND_ERR,
  USER_ALREADY_CREATED,
  USER_NOT_FOUND_ERR,
  WITHDRAW_ERR,
} from "../../errors/errors.js";

const findAllAdmin = async (req, res) => {
  let admins = await adminService.findAll();
  return res.status(httpStatus.OK).json({ data: admins });
};

const findAdminByCode = async (req, res) => {
  const { data } = matchedData(req);
  const admin = await adminService.findByAdminCode(data.adminCode);
  if (admin.error) {
    switch (admin.error) {
      case ADMIN_NOT_FOUND_ERR:
        return res.status(httpStatus.BAD_REQUEST).json({
          message: `Not found admin with admin code: ${data.adminCode}`,
        });
    }
  }
  return res.status(httpStatus.OK).json({ data: admin.data });
};

const createAdmin = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: result.array() });
  }
  const data = matchedData(req);
  const admin = await adminService.create(data);
  if (admin.error) return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
  return res.status(201).json({ data: admin.data });
};

const deactivateAdmin = async (req, res) => {
  const { data } = matchedData(req);
  let admin = await adminService.findByAdminCode(data.adminCode);
  console.info("admin ", admin);
  if (admin.error) {
    switch (admin.error) {
      case ADMIN_NOT_FOUND_ERR:
        return res.status(httpStatus.BAD_REQUEST).json({
          message: `Not found admin with admin code: ${data.adminCode}`,
        });
    }
  }
  if (admin.data.isDeactivated) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "Admin is already deactivated",
    });
  }
  admin = await adminService.deactivate(data.adminCode);
  if (admin.error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
  }
  return res.status(httpStatus.OK).json({ data: admin.data });
};

const adminActions = async (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const { process } = matchedData(req);
    switch (process) {
      case "deactivate":
        return await deactivateAdmin(req, res);
      case "search":
        return await findAdminByCode(req, res);
      default:
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "Invalid process name" });
    }
  }
  return res.status(httpStatus.BAD_REQUEST).json({ message: result.array() });
};

const transfer = async (req, res) => {
  const { adminId, data } = matchedData(req);

  const transaction = await adminService.transfer({
    senderUsername: data.sender,
    receiverUsername: data.receiver,
    transferAmount: data.transferAmount,
    note: data.note,
    adminId,
  });

  if (transaction.error) {
    switch (transaction.error) {
      case ADMIN_NOT_FOUND_ERR:
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "Admin not found" });
      case SENDER_NOT_FOUND_ERR:
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "Sender not found" });
      case RECEIVER_NOT_FOUND_ERR:
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "Receiver not found" });
    }
  }

  return res.status(httpStatus.OK).json({ data: transaction.data });
};

const listTransactionsByUserEmail = async (req, res) => {
  const { data } = matchedData(req);
  const transactions = await adminService.getTransactions(data.username);

  if (transactions.error) {
    switch (transactions.error) {
      case ADMIN_NOT_FOUND_ERR:
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "Admin not found." });
    }
  }

  return res.status(httpStatus.OK).json({ data: transactions.data });
};

const withdrawOrDeposit = async (req, res) => {
  let user;
  const { process, adminId, data } = matchedData(req);

  switch (process) {
    case "withdraw":
      user = await adminService.withdraw(data.username, data.amount, adminId);
      break;
    case "deposit":
      user = await adminService.deposit(data.username, data.amount, adminId);
      break;
  }

  if (user.error) {
    switch (user.error) {
      case ADMIN_NOT_FOUND_ERR:
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "Admin not found" });
      case USER_NOT_FOUND_ERR:
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "User not found" });
      case WITHDRAW_ERR:
      case DEPOSIT_ERR:
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "Something go wrong!" });
    }
  }

  return res.status(httpStatus.OK).json({ data: user.data });
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
    case "deposit":
      return withdrawOrDeposit(req, res);
    case "list":
      return listTransactionsByUserEmail(req, res);
    default:
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Invalid transfer type name" });
  }
};

const userRegistration = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty())
    return res.status(httpStatus.BAD_REQUEST).json({ message: result.array() });

  const data = matchedData(req);

  const user = await adminService.userRegistration(data);
  if (user.error)
    switch (user.error) {
      case USER_ALREADY_CREATED:
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "User is already created." });
      case ADMIN_NOT_FOUND_ERR:
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "Admin not found." });
      default:
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
    }

  return res.status(httpStatus.CREATED).json({ data: user.data });
};

const login = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(httpStatus.BAD_REQUEST).json({ message: result.array() });

  const { adminCode, password } = matchedData(req);
  const { data, error } = await adminService.login(adminCode, password);
  if (error)
    switch (error) {
      case ADMIN_NOT_FOUND_ERR:
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: `Admin is not found with code: ${adminCode}` });
      default:
        return res
          .status(httpStatus.FORBIDDEN)
          .json({ message: "Accessed denied." });
    }
  return res.status(httpStatus.OK).json({ data: { token: data } });
};

export default {
  findAllAdmin,
  createAdmin,
  adminActions,
  transactions,
  userRegistration,
  login,
};
