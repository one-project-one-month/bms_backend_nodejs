import db from "../../database/index.js";

const getAll = async () => {
  return db.transaction.findMany();
};

const create = async (data) => {
  return db.transaction.create({
    data,
  });
};

export default {
  getAll,
  create,
};
