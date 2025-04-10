// src/app.js
import express from 'express';
import routes from './routes/index.js';
import  dotenv from 'dotenv';

import { setMaxListeners } from 'events';
setMaxListeners(20); // or any reasonable number

dotenv.config()


const app = express();
app.use(express.json());
app.use('/api', routes);

export default app;
