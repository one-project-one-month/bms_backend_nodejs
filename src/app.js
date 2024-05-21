import express from "express";
import cors from "cors";
import { connectDatabase } from "./database/index.js";
import homeRoute from "./features/home/home.router.js";
import adminRoute from "./features/admins/admins.routes.js";
import { V1 } from "./configs.js";

connectDatabase();
const app = express();

app.use(express.json()); // Enable JSON parsing for all routes
app.use(cors()); // Enable CORS for all routes

app.use("/", homeRoute);
app.use(`/${V1}/admins`, adminRoute);

export default app;
