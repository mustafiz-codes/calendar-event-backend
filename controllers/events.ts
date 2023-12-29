import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import EventModel, { IEvent } from "../src/db/events";

function generateRepeatingEvents(eventData: IEvent): IEvent[] {
  let events: IEvent[] = [];
  let nextDate = new Date(eventData.startDate);
  const endDate = new Date(eventData.startDate);
  endDate.setFullYear(endDate.getFullYear() + 1); // 1 year from start date

  // Destructure only the necessary fields from eventData
  const {
    title,
    description,
    notes,
    isFullDay,
    startTime,
    endTime,
    repeat,
    repeatCycle,
  } = eventData;

  const recurringEventId = eventData._id;

  while (nextDate < endDate) {
    nextDate = new Date(nextDate); // Clone date to avoid mutation
    // Calculate the next occurrence date
    switch (eventData.repeat) {
      case "daily":
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case "weekly":
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case "monthly":
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case "yearly":
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }

    if (nextDate < endDate) {
      const newEvent: IEvent = {
        _id: uuidv4(),
        recurringEventId,
        title,
        description,
        notes,
        startDate: nextDate,
        endDate: eventData.endDate, // Or calculate based on repeat pattern
        isFullDay,
        startTime,
        endTime,
        repeat,
        repeatCycle,
      };
      events.push(newEvent);
    }
  }

  return events;
}

export const createEvent = async (req: Request, res: Response) => {
  try {
    const eventData: IEvent = { _id: uuidv4(), ...req.body };
    const newEvent = new EventModel(eventData);
    await newEvent.save();

    if (eventData.repeat !== "none") {
      const additionalEvents = generateRepeatingEvents(eventData);
      await EventModel.insertMany(additionalEvents);
    }

    res.status(201).send(newEvent);
  } catch (error) {
    console.error("Error in POST /events:", error);
    res.status(500).send("Error processing request");
  }
};

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const allEvents = await EventModel.find({}); // This will fetch all events from MongoDB
    res.send(allEvents);
  } catch (error) {
    console.error("Error in GET /events:", error);
    res.status(500).send("Error processing request");
  }
};

export const getEventById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const event = await EventModel.findById(id); // No need to cast to IEvent, findById returns a Document
    if (event) {
      return res.send(event);
    } else {
      return res.status(404).send("Event not found");
    }
  } catch (error) {
    console.error("Error in GET /events/:id:", error);
    res.status(500).send("Error processing request");
  }
};

export const updateEventById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Update the event and return the new document
    const updatedEvent = await EventModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (updatedEvent) {
      res.send(updatedEvent);
    } else {
      res.status(404).send("Event not found");
    }
  } catch (error) {
    console.error("Error in PUT /events/:id:", error);
    res.status(500).send("Error processing request");
  }
};

export const deleteEventById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedEvent = await EventModel.findByIdAndDelete(id);
    if (deletedEvent) {
      res.send({ message: "Event deleted successfully" });
    } else {
      res.status(404).send("Event not found");
    }
  } catch (error) {
    console.error("Error in DELETE /events/:id:", error);
    res.status(500).send("Error processing request");
  }
};

export const deleteRecurringEvents = async (req: Request, res: Response) => {
  const { recurringEventId } = req.params;
  try {
    // This will remove all events with the provided recurringEventId
    const result = await EventModel.deleteMany({ recurringEventId });
    if (result.deletedCount > 0) {
      res.send({ message: "Recurring events deleted successfully" });
    } else {
      res.status(404).send("No recurring events found with the given ID");
    }
  } catch (error) {
    console.error(
      "Error in DELETE /events/recurring/:recurringEventId:",
      error
    );
    res.status(500).send("Error processing request");
  }
};

export const getEventsByRange = async (req: Request, res: Response) => {
  const { start, end } = req.query;

  if (typeof start === "string" && typeof end === "string") {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate > endDate) {
      return res.status(400).send("End date must be after start date");
    }

    try {
      const filteredEvents = await EventModel.find({
        startDate: { $gte: startDate },
        endDate: { $lte: endDate },
      });

      res.send(filteredEvents);
    } catch (error) {
      console.error("Error in GET /events/range:", error);
      res.status(500).send("Error processing request");
    }
  } else {
    res
      .status(400)
      .send("Start and end dates must be provided in the query string");
  }
};

export const updateRecurringEvents = async (req: Request, res: Response) => {
  const { recurringEventId } = req.params;
  const updateData = req.body;

  try {
    // This will update all events with the provided recurringEventId
    const result = await EventModel.updateMany(
      { recurringEventId },
      { $set: updateData },
      { new: true }
    );

    if (result.matchedCount > 0) {
      res.send({ message: "Recurring events updated successfully" });
    } else {
      res.status(404).send("No recurring events found with the given ID");
    }
  } catch (error) {
    console.error("Error in PUT /events/recurring/:recurringEventId:", error);
    res.status(500).send("Error processing request");
  }
};
