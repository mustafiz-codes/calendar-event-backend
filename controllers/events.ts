import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import Event from "../src/db/events";

export const createEvent = async (req: Request, res: Response) => {
  try {
    const newEvent = new Event({ _id: uuidv4(), ...req.body });
    await newEvent.save();
    res.status(201).send(newEvent);
  } catch (error) {
    console.error("Error in POST /events:", error);
    res.status(500).send("Error processing request");
  }
};

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const allEvents = await Event.find({}); // This will fetch all events from MongoDB
    res.send(allEvents);
  } catch (error) {
    console.error("Error in GET /events:", error);
    res.status(500).send("Error processing request");
  }
};

export const getEventById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id); // No need to cast to IEvent, findById returns a Document
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
    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, {
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
    const deletedEvent = await Event.findByIdAndDelete(id);
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

export const getEventsByRange = async (req: Request, res: Response) => {
  const { start, end } = req.query;

  if (typeof start === "string" && typeof end === "string") {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate > endDate) {
      return res.status(400).send("End date must be after start date");
    }

    try {
      const filteredEvents = await Event.find({
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
