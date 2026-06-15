// src/controllers/emailWorker.js
import { Worker } from 'bullmq'
import IORedis from 'ioredis'
import nodemailer from 'nodemailer'
import { connectDB } from '../lib/db.js'
import {User} from '../models/userModel.js'

const connection = new IORedis({ maxRetriesPerRequest: null });
await connectDB();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

const worker = new Worker('notificationQueue', async job => {
    try {
    const { userId, type, url } = job.data;
    const user = await User.findById(userId);
    if(!user){
        throw new Error("User not found");
    }
    const subject =
      type === "INCIDENT"
        ? `🚨 Site Down: ${url}`
        : `✅ Site Recovered: ${url}`

    const text =
      type === "INCIDENT"
        ? `Oyee!! heads up...${url} is DOWN.`
        : `We are back in the game Baby!!\n${url} is back online.`

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email, 
      subject,
      text
    })

    console.log(`Email sent to ${user.name} for ${subject}`)

    } catch (err) {
        console.error("Error while sending email: \n", err.message);
        throw err;
    }
  },
  { connection }
)
