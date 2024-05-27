import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generatePersonalCode = (data) =>
  `bms_${crypto.hash("md5", data + new Date().toISOString())}`;

const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

const checkPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

const generateToken = ({ adminCode, role }) => {
  const token = jwt.sign({ adminCode, role }, process.env["ADMIN_TOKEN"]);
  return token;
};

export { generatePersonalCode, hashPassword, checkPassword, generateToken };
