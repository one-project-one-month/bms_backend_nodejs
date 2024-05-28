import jwt from "jsonwebtoken";
import httpStatus from "http-status-codes";

export default function auth(req, res, next) {
  let token = req.headers.authorization;
  token = token.split(" ")[1];

  if (!token) return res.status(httpStatus.UNAUTHORIZED).end();
  const data = jwt.verify(token, process.env["ADMIN_TOKEN"]);
  if (!data) {
    return res.status(httpStatus.UNAUTHORIZED).end();
  }
  next();
}
