import { v4 as uuidv4 } from 'uuid';
import { IEvent } from '../db/event.interface';

export function generateRepeatingEvents(eventData: IEvent): IEvent[] {
  // Validation for date types
  const events: IEvent[] = [];
  const recurringEventId = uuidv4();

  if (!eventData.repeatCycle || eventData.repeatCycle < 1) {
    eventData.repeatCycle = 1;
  }

  const nextStartDate = new Date(eventData.startDate);
  if (isNaN(nextStartDate.getTime())) {
    throw new Error('Invalid startDate provided.');
  }

  let nextEndDate: Date;
  if (eventData.endDate) {
    nextEndDate = new Date(eventData.endDate);
    if (isNaN(nextEndDate.getTime())) {
      throw new Error('Invalid endDate provided.');
    }
  } else {
    nextEndDate = new Date(eventData.startDate);
  }

  const duration = nextEndDate.getTime() - nextStartDate.getTime();

  const incrementDate = (date, repeat, repeatCycle) => {
    switch (repeat) {
      case 'daily':
        date.setDate(date.getDate() + 1 * repeatCycle);
        break;
      case 'weekly':
        date.setDate(date.getDate() + 7 * repeatCycle);
        break;
      case 'monthly': {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        // Determine the number of days in the current month
        const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();

        // Add the number of days in the current month to the date
        date.setDate(day + daysInCurrentMonth);

        // If the date rolls over to an additional month, adjust the month and year
        if (date.getMonth() !== month) {
          date.setFullYear(date.getFullYear(), date.getMonth(), day);
        }
        break;
      }
      case 'yearly': {
        const day = date.getDate();
        const month = date.getMonth();

        const year = date.getFullYear();

        // Add years based on repeatCycle
        date.setFullYear(year + repeatCycle);

        // Check for leap year if the date is February 29th
        const isLeapYear = (year) => new Date(year, 1, 29).getMonth() === 1;

        // If the original date was February 29th, and the new year isn't a leap year,
        // adjust the date to February 28th.
        if (month === 1 && day === 29 && !isLeapYear(date.getFullYear())) {
          date.setDate(28);
        }
        break;
      }
      case 'none':
        // No action needed for 'none'
        break;
      default:
        throw new Error(`Unknown repeat interval: ${repeat}`);
    }
  };

  // Determine the end date for repeating events
  let repeatEndDate;
  if (eventData.repeat === 'yearly') {
    repeatEndDate = new Date(
      nextStartDate.getFullYear() + 3,
      nextStartDate.getMonth(),
      nextStartDate.getDate()
    );
  } else {
    repeatEndDate = new Date(nextStartDate.getFullYear(), 11, 31); // December 31st of current year
  }

  while (nextStartDate < repeatEndDate) {
    const eventEndDate = new Date(nextStartDate.getTime() + duration);
    const eventId = uuidv4();

    events.push({
      ...eventData,
      _id: eventId,
      startDate: new Date(nextStartDate),
      endDate: eventEndDate,
      repeatCycle: eventData.repeatCycle,
      recurringEventId: recurringEventId,
    });

    if (eventData.repeat !== 'none') {
      // Increment the date for repeated events
      incrementDate(nextStartDate, eventData.repeat, eventData.repeatCycle);
    } else {
      break; // Exit the loop as it's a non-repeating event
    }
  }
  const idSet = new Set(events.map((e) => e._id));
  if (idSet.size !== events.length) {
    console.error('Duplicate IDs detected in generated events.');
  }

  return events;
}
