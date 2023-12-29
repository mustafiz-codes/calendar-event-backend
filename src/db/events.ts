import { Document, Schema, model } from "mongoose";

// Define the IEvent interface
export interface IEvent {
  _id: string;
  recurringEventId?: string;
  title: string;
  description?: string;
  notes?: string;
  startDate: Date;
  endDate?: Date;
  isFullDay: boolean;
  startTime?: string;
  endTime?: string;
  repeat: "none" | "daily" | "weekly" | "monthly" | "yearly";
  repeatCycle?: number;
}

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

const EventModel = model<IEvent>("Event", eventSchema);

export default EventModel;
