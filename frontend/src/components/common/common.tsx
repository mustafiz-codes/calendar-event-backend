export interface Event {
  _id: string; // Using _id instead of id as per Mongoose schema
  title: string;
  description?: string;
  startDate: string; // ISO date string, e.g., "2023-12-25"
  endDate?: string; // ISO date string, e.g., "2023-12-25"
  startTime?: string; // Optional start time as a string, e.g., "10:00"
  endTime?: string; // Optional end time as a string, e.g., "11:00"
  isFullDay: boolean;
  repeat?: "none" | "daily" | "weekly" | "monthly" | "yearly";
  repeatCycle?: number;
}

export const getDatesInRange = (
  startDate: string,
  endDate: string
): string[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates = [];

  while (start < end) {
    dates.push(new Date(start).toISOString().split("T")[0]); // 'YYYY-MM-DD'
    start.setDate(start.getDate() + 1);
  }

  // Add the end date only if it is different from the start date
  if (startDate !== endDate) {
    dates.push(endDate);
  }

  return dates;
};

export const hourHeight = 48; // For example, each hour block is 48px tall

// Util function to get day name abbreviation
export const getDayNameAbbreviation = (date: Date) => {
  return date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
};

export const to24HourTime = (time: string): string => {
  // Validate time format (optional)
  if (!/^\d{2}:\d{2}$/.test(time)) {
    console.error(`Invalid time format: "${time}"`);
    return "00:00"; // Return a default value for invalid format
  }

  return time; // Return the time as it is in 24-hour format
};

// Function to get the current week's dates
export const getWeekDates = (date: Date) => {
  const weekStart = new Date(date);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const weekDate = new Date(weekStart);
    weekDate.setDate(weekStart.getDate() + i);
    return {
      dayOfWeek: getDayNameAbbreviation(weekDate),
      fullDate: weekDate.toISOString().split("T")[0], // 'YYYY-MM-DD'
      date: weekDate.getDate(),
    };
  });
};

// Process events to be keyed by fullDate and startTime for easy access
export const eventsByDateAndTime: {
  [fullDate: string]: { [startTime: string]: Event[] };
} = {};

export const times = Array.from({ length: 24 }, (_, index) => `${index}:00 `);

export const getHourIndex = (time: string): number => {
  const [hour] = time.split(":").map(Number);
  return hour; // returns 0 for 12:00 AM, 1 for 1:00 AM, etc.
};

export const daysDifference = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
};

export const calculateTop = (event: Event): number => {
  if (event.isFullDay) {
    return 0; // Full-day events start at the top
  }
  // Non full-day events calculate the top based on the start time
  const time = event.startTime || "00:00";
  return calculateTimePosition(time);
};

export const calculateTimePosition = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours * 60 + minutes) * (hourHeight / 60);
};

export const calculateDurationHeight = (start: string, end: string): number => {
  const [startHours, startMinutes] = start.split(":").map(Number);
  const [endHours, endMinutes] = end.split(":").map(Number);
  return (
    ((endHours - startHours) * 60 + (endMinutes - startMinutes)) *
    (hourHeight / 60)
  );
};

export const calculateHeight = (event: Event): number => {
  if (event.isFullDay) {
    return hourHeight; // Full-day event height
  }
  // For non full-day events, calculate the height based on the time duration
  const start = event.startTime || "00:00";
  const end = event.endTime || "23:59";
  return calculateDurationHeight(start, end);
};

export const calculateWidthAndLeft = (
  event: Event,
  dayIndex: number
): [number, number] => {
  if (event.isFullDay) {
    return [100, 0];
  }
  let width = 100;
  let left = 0;
  const daySpan = event.endDate
    ? daysDifference(event.startDate, event.endDate)
    : 0;

  if (daySpan > 0) {
    width = 100 / (daySpan + 1); // Divide the width by the number of days
    left = width * dayIndex; // Position based on the day index
  }

  return [width, left];
};
