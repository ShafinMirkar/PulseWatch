import mongoose from "mongoose"

const checkResultSchema = new mongoose.Schema({
  monitorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Monitor",
    index: true
  },

  statusCode: Number,
  responseTime: Number,

  success: {
    type: Boolean,
    required: true
  },

  errorMessage: String,

  methodUsed: String,

  checkedAt: {
    type: Date,
    default: Date.now
  }
})

export const CheckResult = mongoose.model("CheckResult", checkResultSchema)