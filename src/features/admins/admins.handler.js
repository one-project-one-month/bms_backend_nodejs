import crypto from "crypto";

const generatePersonalCode = (data) => `bms_${crypto.hash("md5", data)}`;

export { generatePersonalCode };
