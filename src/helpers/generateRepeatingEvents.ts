import { v4 as uuidv4 } from "uuid";
import { IEvent } from "../db/event.interface";

export function generateRepeatingEvents(eventData: IEvent): IEvent[] {
  let events: IEvent[] = [];
  let nextStartDate = new Date(eventData.startDate);
  let nextEndDate = eventData.endDate ? new Date(eventData.endDate) : null;
  const duration = nextEndDate
    ? nextEndDate.getTime() - nextStartDate.getTime()
    : 0;

  // Set repeatEndDate to the end of the current year
  const repeatEndDate = new Date(nextStartDate.getFullYear(), 11, 31); // December 31st of current year

  // Function to increment date based on repeatCycle
  const incrementDate = (date, repeatCycle) => {
    switch (repeatCycle) {
      case "daily":
        date.setDate(date.getDate() + 1);
        break;
      case "biweekly":
        date.setDate(date.getDate() + 14); // 2 weeks
        break;
      case "weekly":
        date.setDate(date.getDate() + 7);
        break;
      case "monthly":
        date.setMonth(date.getMonth() + 1);
        break;
      case "yearly":
        date.setFullYear(date.getFullYear() + 1);
        break;
    }
  };

  while (nextStartDate < repeatEndDate) {
    incrementDate(nextStartDate, eventData.repeatCycle);
    let adjustedEndDate = nextEndDate
      ? new Date(nextStartDate.getTime() + duration)
      : null;

    if (nextStartDate < repeatEndDate) {
      events.push({
        _id: uuidv4(),
        title: eventData.title,
        description: eventData.description,
        notes: eventData.notes,
        startDate: new Date(nextStartDate.getTime()),
        endDate: adjustedEndDate,
        isFullDay: eventData.isFullDay,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        repeat: eventData.repeat,
        repeatCycle: eventData.repeatCycle,
      });
    }
  }

  return events;
}
