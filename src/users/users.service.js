import db from "../database/index.js";

async function createUser(data) {
  return db.user.create({
    data,
  });
}

async function getUserByEmail(email) {
  return db.user.findUnique({
    where: { email },
  });
}

async function getAll() {
  return db.user.findMany();
}

async function getUserById(id) {
  return db.user.findUnique({
    where: { id: id },
  });
}

async function updateUser(id, data) {
  return db.user.update({
    where: { id: id },
    data,
  });
}

async function deleteUser(id) {
  return db.user.update({
    where: { id: id },
    data: {
      isDeactivated: true,
      isDeleted: true,
    },
  });
}

export default {
  createUser,
  getUserByEmail,
  getAll,
  getUserById,
  updateUser,
  deleteUser,
};
