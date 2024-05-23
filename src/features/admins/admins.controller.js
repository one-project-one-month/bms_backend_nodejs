import httpStatus from "http-status-codes";
import { apiRes } from "../../response/response.js";
import adminService from "./admins.service.js";
import { exceptionHandler } from "../../handlers/exception.js";

const resp = apiRes("admins", "Admin");

const findAllAdmin = async (req, res) => {
  const personalCode = req.query["search"];
  if (personalCode) {
    return findAdminByCode(req, res);
  }
  let admins = await exceptionHandler(adminService.findAll)();
  if (admins instanceof Error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
  }
  admins = admins.map((admin) => resp.one(admin));
  return res.status(httpStatus.OK).json(resp.collection(admins));
};

const findAdminById = async (req, res) => {
  const id = req.params["id"];
  const admin = await exceptionHandler(adminService.findById)(id);
  if (admin instanceof Error) {
    switch (admin.message) {
      case "No Admin found":
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: `not found admin with id: ${id}` });
      default:
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "something went wrong!!!!" });
    }
  }
  return res.status(httpStatus.OK).json(resp.one(admin));
};

const findAdminByCode = async (req, res) => {
  const personalCode = req.query["search"];
  const admin = await exceptionHandler(adminService.findByPersonalCode)(
    personalCode
  );
  if (admin instanceof Error) {
    switch (admin.message) {
      case "No Admin found":
        return res.status(httpStatus.BAD_REQUEST).json({
          message: `not found admin with personal code: ${personalCode}`,
        });
      default:
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "something went wrong!!!!" });
    }
  }
  return res.status(httpStatus.OK).json(resp.one(admin));
};

const createAdmin = async (req, res) => {
  const { name, password, role } = req.body;
  const admin = await adminService.create(name, password, role);
  if (!admin) return res.status(500).json({ msg: "Internal server error" });
  return res.status(201).json(resp.one(admin));
};

const deactivateAdmin = async (req, res) => {
  const id = req.params["id"];
  const admin = await adminService.deactivate(id);
  return res.status(200).json(resp.one(admin));
};

const adminActions = async (req, res) => {
  const { name } = req.body;
  switch (name) {
    case "deactivate":
      return deactivateAdmin(req, res);
    default:
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Invalid action name" });
  }
};

export default {
  findAllAdmin,
  findAdminById,
  createAdmin,
  adminActions,
};
