import services from "./users.service.js";

const findUserByEmail = async (email) => services.findByEmail(email);
const changeBalance = async (id, balance) => services.update(id, { balance });

export default {
  findUserByEmail,
  changeBalance,
};
