import crypto from "crypto";
import bcrypt from "bcrypt";

const generatePersonalCode = (data) =>
  `bms_${crypto.hash("md5", data + new Date().toISOString())}`;

const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

const checkPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export { generatePersonalCode, hashPassword, checkPassword };
