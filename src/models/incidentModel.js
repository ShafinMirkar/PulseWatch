import mongoose from "mongoose"

const IncidentStatus = ["ONGOING", "RESOLVED"]

const incidentSchema = new mongoose.Schema({
  monitorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Monitor",
    index: true
  },

  startTime: {
    type: Date,
    required: true
  },

  endTime: Date,

  status: {
    type: String,
    enum: IncidentStatus,
    required: true
  }
})

export const Incident = mongoose.model("Incident", incidentSchema)