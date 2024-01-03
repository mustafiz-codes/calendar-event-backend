// CalendarContext.js
import React, { ReactNode, createContext, useContext, useState } from "react";

export interface CalendarContextType {
  currentDate: Date;
  viewType: "week" | "month";
  setCurrentDate: (date: Date) => void;
  setViewType: (viewType: "week" | "month") => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
  goToToday: () => void;
}

export const CalendarContext = createContext<CalendarContextType>({
  currentDate: new Date(),
  viewType: "week",
  setCurrentDate: () => {},
  setViewType: () => {},
  goToPreviousMonth: () => {},
  goToNextMonth: () => {},
  goToPreviousWeek: () => {},
  goToNextWeek: () => {},
  goToToday: () => {},
});

export const useCalendar = () => useContext(CalendarContext);

export const CalendarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<"week" | "month">("week");

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToPreviousWeek = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
  };

  const goToNextWeek = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <CalendarContext.Provider
      value={{
        currentDate,
        viewType,
        setCurrentDate,
        setViewType,
        goToPreviousMonth,
        goToNextMonth,
        goToPreviousWeek,
        goToNextWeek,
        goToToday,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
