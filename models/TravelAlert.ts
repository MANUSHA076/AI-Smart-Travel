import mongoose, { Schema, model, models } from "mongoose";

const TravelAlertSchema = new Schema({
  type: { type: String, required: true }, // e.g., "Flood"
  location: { type: String, required: true }, // e.g., "Galle"
  riskLevel: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
  message: { type: String, required: true },
}, { timestamps: true });

const TravelAlert = models.TravelAlert || model("TravelAlert", TravelAlertSchema);
export default TravelAlert;