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
      if ((error.name = "NotFoundError"))
        return res.status(400).json({ msg: error.name });
      return res.status(500).json({ msg: "Internal server error" });
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
    if ((error.name = "NotFoundError"))
      return res.status(400).json({ msg: error.name });
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const createAdmin = async (req, res) => {
  const { name, password, role } = req.body;
  const admin = await adminService.create(name, password, role);
  if (!admin) return res.status(500).json({ msg: "Internal server error" });
  return res.status(201).json(resp.one(admin));
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
