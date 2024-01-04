import { Request, Response } from 'express';
import * as EventService from '../services/event.service';

export const createEvent = async (req: Request, res: Response) => {
  try {
    const newEvent = await EventService.createEventService(req.body);
    res.status(201).send(newEvent);
  } catch (error) {
    console.error('Error in POST /events:', error);
    res.status(500).send('Error processing request');
  }
};

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const allEvents = await EventService.getAllEventsService();
    res.send(allEvents);
  } catch (error) {
    console.error('Error in GET /events:', error);
    res.status(500).send('Error processing request');
  }
};

export const getEventById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const event = await EventService.getEventByIdService(id);
    if (event) {
      return res.send(event);
    } else {
      return res.status(404).send('Event not found');
    }
  } catch (error) {
    console.error('Error in GET /events/:id:', error);
    res.status(500).send('Error processing request');
  }
};

export const updateEventById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedEvent = await EventService.updateEventByIdService(
      id,
      req.body
    );
    if (updatedEvent) {
      res.send(updatedEvent);
    } else {
      res.status(404).send('Event not found');
    }
  } catch (error) {
    console.error('Error in PUT /events/:id:', error);
    res.status(500).send('Error processing request');
  }
};

export const deleteEventById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedEvent = await EventService.deleteEventByIdService(id);
    if (deletedEvent) {
      res.send({ message: 'Event deleted successfully' });
    } else {
      res.status(404).send('Event not found');
    }
  } catch (error) {
    console.error('Error in DELETE /events/:id:', error);
    res.status(500).send('Error processing request');
  }
};

export const deleteRecurringEvents = async (req: Request, res: Response) => {
  const { recurringEventId } = req.params;
  try {
    const result = await EventService.deleteRecurringEventsService(
      recurringEventId
    );
    const deletedCount = result.deletedCount ?? 0; // Provide a fallback of 0 if deletedCount is undefined
    if (deletedCount > 0) {
      res.send({ message: 'Recurring events deleted successfully' });
    } else {
      res.status(404).send('No recurring events found with the given ID');
    }
  } catch (error) {
    console.error(
      'Error in DELETE /events/recurring/:recurringEventId:',
      error
    );
    res.status(500).send('Error processing request');
  }
};

export const getEventsByRange = async (req: Request, res: Response) => {
  const { start, end } = req.query;
  if (typeof start === 'string' && typeof end === 'string') {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (startDate > endDate) {
      return res.status(400).send('End date must be after start date');
    }
    try {
      const filteredEvents = await EventService.getEventsByRangeService(
        startDate,
        endDate
      );
      res.send(filteredEvents);
    } catch (error) {
      console.error('Error in GET /events/range:', error);
      res.status(500).send('Error processing request');
    }
  } else {
    res
      .status(400)
      .send('Start and end dates must be provided in the query string');
  }
};

export const updateRecurringEvents = async (req: Request, res: Response) => {
  const { recurringEventId } = req.params;
  const updateData = req.body;
  try {
    const result = await EventService.updateRecurringEventsService(
      recurringEventId,
      updateData
    );
    const matchedCount = result.matchedCount ?? 0;
    if (matchedCount > 0) {
      res.send({ message: 'Recurring events updated successfully' });
    } else {
      res.status(404).send('No recurring events found with the given ID');
    }
  } catch (error) {
    console.error('Error in PUT /events/recurring/:recurringEventId:', error);
    res.status(500).send('Error processing request');
  }
};
