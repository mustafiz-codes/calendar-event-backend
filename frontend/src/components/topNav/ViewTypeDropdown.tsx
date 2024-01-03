import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useCalendar } from "../../context/CalendarContext";

const ViewTypeDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selection, setSelection] = useState("Week");
  const location = useLocation();
  const {
    currentDate,
    viewType,
    setViewType,
    goToPreviousMonth,
    setCurrentDate,
    goToNextMonth,
    goToPreviousWeek,
    goToNextWeek,
    goToToday,
  } = useCalendar();
  const toggleDropdown = () => setIsOpen(!isOpen);

  const viewTypeChange = (type: string) => {
    setIsOpen(false);
    setSelection(type);
  };

  useEffect(() => {
    // Update the selection based on the current path
    const path = location.pathname;
    if (path === "/month") {
      setSelection("Month");
      setViewType("month");
    } else if (path === "/year") {
      setSelection("Year");
    } else {
      setSelection("Week");
      setViewType("week");
    }
  }, [location]);

  return (
    <div className="relative inline-block text-left">
      <div
        className="border p-2 shadow cursor-pointer flex justify-between items-center"
        onClick={toggleDropdown}
      >
        {selection}
        <FontAwesomeIcon icon={faCaretDown} className="ml-2" />
      </div>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <Link
              to="/"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              onClick={() => viewTypeChange("Week")}
            >
              Week
            </Link>
            <Link
              to="/month"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              onClick={() => viewTypeChange("Month")}
            >
              Month
            </Link>
            <Link
              to="/year"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              onClick={() => viewTypeChange("Year")}
            >
              Year
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTypeDropdown;
