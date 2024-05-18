import express from 'express';
import cors from 'cors';
import db, {connectDatabase} from "./database/index.js"

connectDatabase();
const app = express();

app.use(express.json()); // Enable JSON parsing for all routes
app.use(cors()); // Enable CORS for all routes


export default app;