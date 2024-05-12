import db from '../database/index.js';

async function getAll() {
  return db.user.findMany();
}

export default {
  getAll,
};