import { v4 as uuidv4 } from "uuid";
import { generateRepeatingEvents } from "../../src/helpers/generateRepeatingEvents";
import { IEvent } from "../db/event.interface";
import EventModel from "../models/event.model";

export const createEventService = async (eventData: IEvent) => {
  eventData._id = uuidv4();

  if (eventData.repeat !== "none") {
    const events = generateRepeatingEvents(eventData);
    // Directly return the Promise
    return EventModel.insertMany(events);
  }

  const newEvent = new EventModel(eventData);
  // No need to await here, just return the Promise
  return newEvent.save();
};

// Get all events
export const getAllEventsService = (): Promise<IEvent[]> => {
  // Directly return the Promise without async/await
  return EventModel.find({});
};

// Get event by ID
export const getEventByIdService = (id: string): Promise<IEvent | null> => {
  return EventModel.findById(id);
};

// Update event by ID
export const updateEventByIdService = (
  id: string,
  updateData: Partial<IEvent>
): Promise<IEvent | null> => {
  return EventModel.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete event by ID
export const deleteEventByIdService = (id: string): Promise<IEvent | null> => {
  // Perform the deletion operation
  return EventModel.findByIdAndDelete(id, { new: true });
};

// Delete recurring events
export const deleteRecurringEventsService = (
  recurringEventId: string
): Promise<{ deletedCount?: number }> => {
  return EventModel.deleteMany({ recurringEventId });
};

// Get events by date range
export const getEventsByRangeService = (
  start: Date,
  end: Date
): Promise<IEvent[]> => {
  return EventModel.find({
    startDate: { $gte: start },
    endDate: { $lte: end },
  });
};

// Update recurring events
export const updateRecurringEventsService = (
  recurringEventId: string,
  updateData: Partial<IEvent>
): Promise<{ matchedCount?: number }> => {
  return EventModel.updateMany(
    { recurringEventId },
    { $set: updateData },
    { new: true }
  );
};

export const deleteAllEvents = (): Promise<{ deletedCount?: number }> => {
  return EventModel.deleteMany({}).then((result) => ({
    deletedCount: result.deletedCount,
  }));
};
