import adminService from "./admin.service.js";

const findAllAdmin = async (req, res) => {
  const admins = await adminService.findAll();
  return res.status(200).json({ admins });
};

const findAdminById = async (req, res) => {
  const id = req.params["id"];
  try {
    const admin = await adminService.findById(id);
    return res.status(200).json({ admin });
  } catch (error) {
    return res.status(400).json({ msg: error.name });
  }
};

const findAdminByPersonalCode = async (req, res) => {
  const personalCode = req.body["personalCode"];
  try {
    const admin = await adminService.findByPersonalCode(personalCode);
    return res.status(200).json({ admin });
  } catch (error) {
    return res.status(400).json({ msg: error.name });
  }
};

const createAdmin = async (req, res) => {
  const { name, personalCode, password, role } = req.body;
  console.info("[create] admin ", req.body, name, personalCode, password, role);
  const admin = await adminService.create(name, personalCode, password, role);
  return res.status(200).json({ admin });
};

const deactivateAdmin = async (req, res) => {
  const personalCode = req.body["personalCode"];
  const admin = await adminService.deactivate(personalCode);
  return res.status(200).json({ admin });
};

export default {
  findAllAdmin,
  findAdminById,
  findAdminByPersonalCode,
  createAdmin,
  deactivateAdmin,
};
