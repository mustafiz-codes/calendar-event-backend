import generateCalendar, { CalendarDay } from "./GenerateCalendar";

describe("generateCalendar", () => {
  it("should generate calendar days for the selected date", () => {
    const selectedDate = new Date("2022-01-01");
    const calendarDays = generateCalendar(selectedDate);

    expect(calendarDays.length).toBe(42);
    expect(calendarDays[0].date).toBe(26);
    expect(calendarDays[0].isToday).toBe(false);
    expect(calendarDays[0].fullDate).toBe("2021-12-26");
    expect(calendarDays[0].currentMonth).toBe(false);
    expect(calendarDays[0].day).toBe("Sun");
  });

  it("should mark today as isToday", () => {
    const selectedDate = new Date();
    const calendarDays = generateCalendar(selectedDate);

    const todayFormatted = selectedDate.toISOString().split("T")[0];

    const today = calendarDays.find((day) => day.isToday);
    expect(today?.fullDate).toBe(todayFormatted);
  });

  it("should generate calendar days for the current month", () => {
    const selectedDate = new Date("2022-01-01");
    const calendarDays = generateCalendar(selectedDate);

    const currentMonthDays = calendarDays.filter((day) => day.currentMonth);
    expect(currentMonthDays.length).toBe(31);
  });

  it("should generate calendar days with correct fullDate", () => {
    const selectedDate = new Date("2022-01-01");
    const calendarDays = generateCalendar(selectedDate);

    expect(calendarDays[0].fullDate).toBe("2021-12-26");
    expect(calendarDays[30].fullDate).toBe("2022-01-25");
  });
});
