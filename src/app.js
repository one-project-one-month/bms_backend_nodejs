import express from "express";
import cors from "cors";
import { connectDatabase } from "./database/index.js";
import adminRoute from "./admin/admin.routes.js";

connectDatabase();
const app = express();

app.use(express.json()); // Enable JSON parsing for all routes
app.use(cors()); // Enable CORS for all routes

app.use("/admins", adminRoute);

export default app;
