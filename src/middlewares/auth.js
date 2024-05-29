import jwt from "jsonwebtoken";
import httpStatus from "http-status-codes";

export default function auth(req, res, next) {
  let token = req.headers.authorization;
  if (!token) return res.status(httpStatus.UNAUTHORIZED).end();

  token = token.split(" ")[1];
  jwt.verify(token, process.env["ADMIN_TOKEN"], (err, data) => {
    if (err) {
      return res.status(httpStatus.UNAUTHORIZED).end();
    }

    req.adminCode = data.adminCode;
    next();
  });
}
