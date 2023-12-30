import { v4 as uuidv4 } from "uuid";
import { IEvent } from "../db/event.interface";

export function generateRepeatingEvents(eventData: IEvent): IEvent[] {
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
