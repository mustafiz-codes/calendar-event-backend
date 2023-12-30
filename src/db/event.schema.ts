import { Schema } from "mongoose";
import { IEvent } from "./event.interface";

const eventSchema = new Schema<IEvent>({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: false },
  notes: { type: String, required: false },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: false },
  isFullDay: { type: Boolean, required: true },
  startTime: { type: String, required: false }, // Could be 'HH:mm' format
  endTime: { type: String, required: false }, // Could be 'HH:mm' format
  repeat: {
    type: String,
    enum: ["none", "daily", "weekly", "monthly", "yearly"],
    default: "none",
  },
  repeatCycle: { type: Number, required: false }, // Used for biweekly, etc.
});

export default eventSchema;
