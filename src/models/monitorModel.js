import mongoose from "mongoose"

const MonitorStatus = ["UP", "DOWN"]

const monitorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  url: {
    type: String,
    required: true
  },

  timeoutMs: {
    type: Number,
    default: 5000
  },

  notifyEmail: {
    type: Boolean,
    default: true
  },
  
  notifySMS: {
    type: Boolean,
    default: false
  },

  intervalSeconds: {
    type: Number,
    default: 60
  },

  isProcessing: {
    type: Boolean,
    default: false
  },

  method: {
    type: String,
    default: "GET"
  },

  expectedStatus: {
    type: Number,
    default: 200
  },

  isActive: {
    type: Boolean,
    default: true
  },

  lastStatus: {
    type: String,
    enum: MonitorStatus
  },

  lastCheckedAt: Date,

  nextCheckAt: Date,

  createdAt: {
    type: Date,
    default: Date.now
  }
})

// unique constraint (user + url)
monitorSchema.index({ userId: 1, url: 1 }, { unique: true })

export const Monitor = mongoose.model("Monitor", monitorSchema)
