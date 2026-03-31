import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './src/lib/db.js';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

// app.use('/api', )

const port = process.env.PORT || 3000

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`server is listening on port: ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
  });