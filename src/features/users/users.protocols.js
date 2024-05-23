import services from "./users.service.js";

const findUserByEmail = async (email) => {
  try {
    const user = await services.findByEmail(email);
    return user;
  } catch (error) {
    return error;
  }
};
const changeBalance = async (id, balance) => services.update(id, { balance });

export default {
  findUserByEmail,
  changeBalance,
};
