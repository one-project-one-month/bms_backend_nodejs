import express from 'express';
import controller from './users.controller.js';

const router = express.Router();

router.get('/', controller.getAll);


export default router;