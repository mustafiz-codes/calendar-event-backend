import { v4 as uuidv4 } from "uuid";
import { IEvent } from "../db/event.interface";

export function generateRepeatingEvents(eventData: IEvent): IEvent[] {
  // Validation for date types

  console.log("eventData", eventData);
  let events: IEvent[] = [];
  let recurringEventId = uuidv4();

  let nextStartDate = new Date(eventData.startDate);
  if (isNaN(nextStartDate.getTime())) {
    throw new Error("Invalid startDate provided.");
  }

  let nextEndDate: Date;
  if (eventData.endDate) {
    nextEndDate = new Date(eventData.endDate);
    if (isNaN(nextEndDate.getTime())) {
      throw new Error("Invalid endDate provided.");
    }
  } else {
    nextEndDate = new Date(eventData.startDate);
  }

  const duration = nextEndDate.getTime() - nextStartDate.getTime();

  const incrementDate = (date, repeat) => {
    switch (repeat) {
      case "daily":
        date.setDate(date.getDate() + 1);
        break;
      case "weekly":
        date.setDate(date.getDate() + 7);
        break;
      case "monthly": {
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();

        // Determine the number of days in the current month
        let daysInCurrentMonth = new Date(year, month + 1, 0).getDate();

        // Add the number of days in the current month to the date
        date.setDate(day + daysInCurrentMonth);

        // If the date rolls over to an additional month, adjust the month and year
        if (date.getMonth() !== month) {
          date.setFullYear(date.getFullYear(), date.getMonth(), day);
        }
        break;
      }
      case "yearly": {
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        const isLeapYear = (year) => new Date(year, 1, 29).getMonth() === 1;

        if (month === 1 && day === 29 && !isLeapYear(year + 1)) {
          date.setFullYear(year + 1, 1, 28);
        } else {
          date.setFullYear(year + 1);
        }
        break;
      }
      case "none":
        // No action needed for 'none'
        break;

      default:
        throw new Error(`Unknown repeat interval: ${repeat}`);
    }
  };

  // Determine the end date for repeating events
  let repeatEndDate;
  if (eventData.repeat === "yearly") {
    repeatEndDate = new Date(
      nextStartDate.getFullYear() + 3,
      nextStartDate.getMonth(),
      nextStartDate.getDate()
    );
  } else {
    repeatEndDate = new Date(nextStartDate.getFullYear(), 11, 31); // December 31st of current year
  }

  while (nextStartDate < repeatEndDate) {
    if (eventData.repeat !== "none") {
      // Increment the date before pushing the event for repeated events
      incrementDate(nextStartDate, eventData.repeat);

      let eventEndDate = new Date(nextStartDate.getTime() + duration);
      let eventId = uuidv4();
      events.push({
        ...eventData,
        _id: eventId,
        startDate: new Date(nextStartDate),
        endDate: eventEndDate,
        repeatCycle: "none",
        recurringEventId: recurringEventId,
      });
    } else {
      // For non-repeating events, push the event without incrementing the date
      let eventId = uuidv4();
      events.push({
        ...eventData,
        _id: eventId,
        startDate: nextStartDate,
        endDate: nextEndDate,
        repeatCycle: "none",
        recurringEventId: recurringEventId,
      });
      break; // Exit the loop as it's a non-repeating event
    }
  }
  const idSet = new Set(events.map((e) => e._id));
  if (idSet.size !== events.length) {
    console.error("Duplicate IDs detected in generated events.");
  }
  console.log("events", events);
  return events;
}
