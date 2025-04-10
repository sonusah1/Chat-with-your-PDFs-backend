// src/index.js
import connectDB from './db/connect.js';
import app from './app.js';
import dotenv from 'dotenv';
dotenv.config();

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`✅ Server is running on port ${process.env.PORT}`);
  });
}).catch(err => {
  console.error('❌ Database connection failed:', err);
});
