import express from 'express';
import cors from 'cors';
import usersRoutes from './users/users.routes.js';


const app = express();

app.use(express.json()); // Enable JSON parsing for all routes
app.use(cors()); // Enable CORS for all routes

//routes
app.use('/api/v1/users', usersRoutes);


app.use('/', (req, res) => {
  res.send('Bank Management System API!');
});



export default app;

