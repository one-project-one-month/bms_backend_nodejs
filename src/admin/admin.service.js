import db from "../database/index.js";

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

const create = async (name, personalCode, password, role) => {
  return db.admin.create({
    data: { name, personalCode, password, role },
  });
};

const deactivate = async (personalCode) => {
  return db.admin.update({
    where: {
      personalCode,
    },
    data: {
      isDeactivaed: true,
    },
  });
};

export default {
  findAll,
  findById,
  findByPersonalCode,
  create,
  deactivate,
};
