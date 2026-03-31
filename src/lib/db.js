// src/lib/db.js
import mongoose from "mongoose"
import "dotenv/config"

export const connectDB = async () => {
  try {
    console.log(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB connected")
  } catch (err) {
    console.error("DB connection error:", err)
    process.exit(1)
  }
}