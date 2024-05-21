import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  return res.json({
    links: {
      self: "localhost:3001/",
      admins: "localhost:3001/api/v1/admins",
    },
  });
});

export default router;
