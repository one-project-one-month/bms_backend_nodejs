import express from "express";
import { HOST, PORT } from "../../configs.js";

const router = express.Router();

router.get("/", (req, res) => {
  return res.json({
    links: {
      self: `${HOST}:${PORT}`,
      admins: `${HOST}:${PORT}/api/v1/admins`,
    },
  });
});

export default router;
