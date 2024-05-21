import express from "express";
import { HOST, PORT, V1 } from "../../configs.js";

const router = express.Router();

router.get("/", (req, res) => {
  return res.json({
    links: {
      kind: "Bank Management System",
      self: `${HOST}:${PORT}`,
      admins: `${HOST}:${PORT}/api/${V1}/admins`,
    },
  });
});

export default router;
