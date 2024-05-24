import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { connectDatabase } from "./database/index.js";
import homeRoute from "./features/home/home.router.js";
import adminRoute from "./features/admins/admins.routes.js";
import userRoute from "./features/users/users.routes.js";

connectDatabase();
const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json()); // Enable JSON parsing for all routes
app.use(cors()); // Enable CORS for all routes

app.use("/", homeRoute);
app.use(`/api/v1/admins`, adminRoute);
app.use(`/api/v1/users`, userRoute);

export default app;
