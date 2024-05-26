import crypto from "crypto";

const generateUsername = (name) =>
  crypto.hash("md5", name + new Date().toISOString());

export default {
  generateUsername,
};
