import { Schema } from "mongoose";
import { IEvent } from "./event.interface";

const eventSchema = new Schema<IEvent>({
  _id: { type: String, required: true },
  recurringEventId: {
    type: String,
    required: false,
  },
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
  repeatCycle: {
    type: Number,
    min: [1, "repeatCycle must be at least 1"], // Enforce minimum value of 1
    default: 1,
  }, // Used for biweekly, etc.
});

// Pre-save hook to format startDate and endDate
eventSchema.pre<IEvent>("save", function (next) {
  if (this.startDate) {
    // Ensuring that the date is set at the start of the day in UTC
    this.startDate = new Date(this.startDate.setUTCHours(0, 0, 0, 0));
  }
  if (this.endDate) {
    // Similarly for endDate
    this.endDate = new Date(this.endDate.setUTCHours(0, 0, 0, 0));
  }
  next();
});

export default eventSchema;
