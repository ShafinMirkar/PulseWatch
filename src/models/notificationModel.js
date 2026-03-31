import mongoose from "mongoose"
import { NotificationType } from "./enums.js"

const notificationLogSchema = new mongoose.Schema({
  monitorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Monitor",
    index: true
  },

  type: {
    type: String,
    enum: NotificationType,
    required: true
  },

  message: String,

  status: String, // SENT / FAILED

  sentAt: {
    type: Date,
    default: Date.now
  }
})

export const NotificationLog = mongoose.model(
  "NotificationLog",
  notificationLogSchema
)