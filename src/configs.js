import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";
const V1 = "api/v1";

export { PORT, HOST, V1 };
