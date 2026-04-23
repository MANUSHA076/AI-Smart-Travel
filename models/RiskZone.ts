import { Schema, model,models} from 'mongoose';

export interface IRiskZone {
    name: string;
    location: {
    lat: number;
    lng: number;
  };
  riskLevel: "High" | "Medium" | "Low";
  description?: string;
  createdAt: Date;
}
export const RiskZoneSchema = new Schema<IRiskZone>({
    name: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    riskLevel: { type: String, enum: ["High", "Medium", "Low"], default: "Low" },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const RiskZone = models.RiskZone || model<IRiskZone>("RiskZone", RiskZoneSchema);

export default RiskZone;
