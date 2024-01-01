import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { generateRepeatingEvents } from "../../src/helpers/generateRepeatingEvents";
import { IEvent } from "../db/event.interface";
import EventModel from "../models/event.model";

export const createEventService = async (eventData: IEvent) => {
  eventData._id = uuidv4();

  if (eventData.repeat !== "none") {
    const events = generateRepeatingEvents(eventData);
    const allEvents = await EventModel.insertMany(events);

    return allEvents;
  }

  const newEvent = new EventModel(eventData);
  return await newEvent.save(); // Now returns an object with the main event and any additional events
};

// Get all events
export const getAllEventsService = async (): Promise<IEvent[]> => {
  return await EventModel.find({});
};

// Get event by ID
export const getEventByIdService = async (
  id: string
): Promise<IEvent | null> => {
  return await EventModel.findById(id);
};

// Update event by ID
export const updateEventByIdService = async (
  id: string,
  updateData: Partial<IEvent>
): Promise<IEvent | null> => {
  return await EventModel.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete event by ID
export const deleteEventByIdService = async (
  id: string
): Promise<IEvent | null> => {
  // Perform the deletion operation
  console.log("id", id);
  const result = await EventModel.findByIdAndDelete(id);

  // Check if a document was found and deleted
  if (result && (result as any).toJSON) {
    return (result as any).toJSON() as IEvent;
  } else {
    return null;
  }
};

// Delete recurring events
export const deleteRecurringEventsService = async (
  recurringEventId: string
): Promise<{ deletedCount?: number }> => {
  return await EventModel.deleteMany({ recurringEventId });
};

// Get events by date range
export const getEventsByRangeService = async (
  start: Date,
  end: Date
): Promise<IEvent[]> => {
  return await EventModel.find({
    startDate: { $gte: start },
    endDate: { $lte: end },
  });
};

// Update recurring events
export const updateRecurringEventsService = async (
  recurringEventId: string,
  updateData: Partial<IEvent>
): Promise<{ matchedCount?: number }> => {
  return await EventModel.updateMany(
    { recurringEventId },
    { $set: updateData },
    { new: true }
  );
};

export const deleteAllEvents = async (): Promise<{ deletedCount?: number }> => {
  const result = await EventModel.deleteMany({});
  return { deletedCount: result.deletedCount };
};
