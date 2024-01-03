// GenerateCalendar.tsx
export interface CalendarDay {
  date: number;
  isToday: boolean;
  fullDate: string;
  currentMonth: boolean;
  day: string;
}

const generateCalendar = (selectedDate: Date): CalendarDay[] => {
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getStartDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const currentDate = new Date();

  const todayFormatted = currentDate.toISOString().split("T")[0];

  const daysInMonth = getDaysInMonth(
    selectedDate.getFullYear(),
    selectedDate.getMonth()
  );
  const startDay = getStartDayOfMonth(
    selectedDate.getFullYear(),
    selectedDate.getMonth()
  );

  const calendarDays: CalendarDay[] = [];

  // Calculate the previous month's overflow days
  const prevMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    0
  );
  const daysInPrevMonth = getDaysInMonth(
    prevMonth.getFullYear(),
    prevMonth.getMonth()
  );
  for (let i = daysInPrevMonth - startDay + 1; i <= daysInPrevMonth; i++) {
    const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), i);
    calendarDays.push({
      date: i,
      isToday: date.toISOString().split("T")[0] === todayFormatted,
      fullDate: date.toISOString().split("T")[0],
      currentMonth: false,
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }

  // Fill in the current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      i
    );
    calendarDays.push({
      date: i,
      isToday: date.toISOString().split("T")[0] === todayFormatted,
      fullDate: date.toISOString().split("T")[0],
      currentMonth: true,
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }

  // Calculate the next month's overflow days to make the total length up to 42
  const nextMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    1
  );
  for (let i = 1; calendarDays.length < 42; i++) {
    const date = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i);
    calendarDays.push({
      date: i,
      isToday: date.toISOString().split("T")[0] === todayFormatted,
      fullDate: date.toISOString().split("T")[0],
      currentMonth: false,
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }

  return calendarDays;
};

export default generateCalendar;
