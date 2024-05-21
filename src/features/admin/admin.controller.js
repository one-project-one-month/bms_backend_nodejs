import { apiRes } from "../../response/response.js";
import adminService from "./admin.service.js";

const resp = apiRes("admins", "Admin");

const findAllAdmin = async (req, res) => {
  const personalCode = req.query["search"];
  if (personalCode) {
    try {
      const admin = await adminService.findByPersonalCode(personalCode);
      return res.status(200).json(resp.one(admin));
    } catch (error) {
      return res.status(400).json({ msg: error.name });
    }
  }
  let admins = await adminService.findAll();
  admins = admins.map((admin) => resp.one(admin));
  return res.status(200).json(resp.collection(admins));
};

const findAdminById = async (req, res) => {
  const id = req.params["id"];
  try {
    const admin = await adminService.findById(id);
    return res.status(200).json(resp.one(admin));
  } catch (error) {
    return res.status(400).json({ msg: error.name });
  }
};

const createAdmin = async (req, res) => {
  const { name, personalCode, password, role } = req.body;
  const admin = await adminService.create(name, personalCode, password, role);
  return res.status(200).json(resp.one(admin));
};

const deactivateAdmin = async (req, res) => {
  const personalCode = req.body["personalCode"];
  const admin = await adminService.deactivate(personalCode);
  return res.status(200).json(resp.one(admin));
};

export default {
  findAllAdmin,
  findAdminById,
  createAdmin,
  deactivateAdmin,
};
