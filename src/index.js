import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 3000; // Default to 3000 if PORT is not set
const HOST = process.env.HOST || 'localhost'; // Default to 'localhost' if HOST is not set

app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});

