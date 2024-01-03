import { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import ViewTypeDropdown from "./ViewTypeDropdown";
import { useCalendar } from "../../context/CalendarContext";
import { useSidebar } from "../../context/SidebarContext";
import CreateEventModal from "../event/CreateEvent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faQuestionCircle,
  faCog,
  faUserCircle,
  faBars,
  faChevronLeft,
  faChevronRight,
  faAdd,
} from "@fortawesome/free-solid-svg-icons";

const TopNav = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { toggleSidebar } = useSidebar();

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

  const handleEventCreated = () => {};

  const handlePrevious = () => {
    console.log("handlePrevious ", viewType);
    if (viewType === "month") {
      goToPreviousMonth();
    } else {
      goToPreviousWeek();
    }
  };

  const handleNext = () => {
    console.log("handleNext ", viewType);
    if (viewType === "month") {
      goToNextMonth();
    } else {
      goToNextWeek();
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="shadow mb-16 z-50" data-testid="top-nav">
      <div className="topNav fixed container-fluid mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Navigation menu icon and logo */}
          <div className="flex flex-auto justify-between md:justify-start items-center gap-4">
            {/* side navbar controller */}
            <button className="text-sky-600  p-2" onClick={toggleSidebar}>
              <FontAwesomeIcon icon={faBars} className="text-sky-600 h-5 w-5" />
            </button>
            {/* Logo */}
            <Link to="/" className="text-lg font-semibold flex items-center">
              <img
                src="/assets/images/logo.png"
                alt="Calendar"
                className="h-12 w-auto"
              />
            </Link>

            <div className="hidden md:flex md:gap-4 align-middle items-center">
              <div onClick={handlePrevious}>
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className="h-5 w-5 cursor-pointer"
                />
              </div>
              <div
                className="border px-4 py-2 hover:shadow cursor-pointer"
                onClick={goToToday}
              >
                Today
              </div>
              <div onClick={handleNext}>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="h-5 w-5 cursor-pointer"
                />
              </div>
              <p className="text-2xl">{formatDate(currentDate)}</p>
            </div>
          </div>

          <div className="hidden md:flex items-center  gap-4">
            <ViewTypeDropdown />

            <FontAwesomeIcon icon={faSearch} className="text-sky-600 h-5 w-5" />

            <FontAwesomeIcon
              icon={faQuestionCircle}
              className="text-sky-600 h-5 w-5"
            />

            <FontAwesomeIcon icon={faCog} className="text-sky-600 h-5 w-5" />

            <FontAwesomeIcon
              icon={faUserCircle}
              className="text-sky-600 h-5 w-5"
            />

            <ThemeToggle />

            <button
              className="cs-btn-theme py-2 px-4 rounded-3xl flex items-center gap-1"
              onClick={handleOpenModal} // Set the onClick handler to open the modal
            >
              <FontAwesomeIcon icon={faAdd} className="h-5 w-5" />
              Create Event
            </button>

            {isModalOpen && (
              <CreateEventModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
