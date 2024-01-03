import React, { useState } from "react";
import { useCalendar } from "../../context/CalendarContext";
import generateCalendar from "./GenerateCalendar";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type CalendarContextType = {
  currentDate: Date;
  setCurrentDate: (date: Date) => void; // Expects a Date object
};

const SingleDatePicker = () => {
  const { currentDate, setCurrentDate } = useCalendar();
  const calendarDays = generateCalendar(currentDate);

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  return (
    <div className="p-4 rounded-lg" data-testid="single-date-picker">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          aria-label="Previous month"
          className="text-gray-600 hover:text-gray-800"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <div>
          <span className="text-lg font-semibold">
            {currentDate.toLocaleString("default", { month: "long" })}{" "}
          </span>
          <span className="text-lg"> / </span>
          <span className="text-lg font-semibold">
            {currentDate.toLocaleString("default", { year: "numeric" })}{" "}
          </span>
        </div>
        <button
          onClick={handleNextMonth}
          aria-label="Next month"
          className="text-gray-600 hover:text-gray-800"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-center font-medium">
            {day}
          </div>
        ))}
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`text-center py-2 cursor-pointer
              ${day.currentMonth ? "" : "text-gray-400"}
              ${
                day.isToday
                  ? "border-2 border-sky-600 text-sky-600 rounded-3xl"
                  : ""
              }
              ${
                day.currentMonth && day.isToday
                  ? "bg-sky-600 text-white"
                  : "hover:bg-sky-200"
              }`}
            onClick={() => {
              if (day.currentMonth) {
                setCurrentDate(new Date(day.fullDate));
              }
            }}
          >
            {day.date}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SingleDatePicker;
