import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useCalendar } from "../context/CalendarContext";
import {
  Event,
  calculateHeight,
  calculateTop,
  calculateWidthAndLeft,
  eventsByDateAndTime,
  getDatesInRange,
  getHourIndex,
  getWeekDates,
  times,
  to24HourTime,
} from "../components/common/common";
import ViewEvent from "../components/event/ViewEvent";
interface EventsByDateAndTime {
  [fullDate: string]: { [startTime: string]: Event[] };
}

const Weekly: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const { currentDate } = useCalendar(); // Using currentDate from CalendarContext
  const [eventsByDateAndTime, setEventsByDateAndTime] =
    useState<EventsByDateAndTime>({});

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // const [selectedEvent, setSelectedEvent] = useState<Event[]>([]);

  useEffect(() => {
    const weekDates = getWeekDates(new Date(currentDate));
    const startOfWeek = weekDates[0].fullDate;
    const endOfWeek = weekDates[weekDates.length - 1].fullDate;

    const apiUrl = `http://localhost:5000/events/range?start=${startOfWeek}&end=${endOfWeek}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((fetchedEvents) => {
        setEvents(fetchedEvents);

        console.log("fetchedEvents", fetchedEvents);
        const newEventsByDateAndTime: EventsByDateAndTime = {};

        fetchedEvents.forEach((event: Event) => {
          const formattedStartDate = event.startDate.split("T")[0];

          if (event.endDate === null) {
            event.endDate = formattedStartDate;
          }
          const formattedEndDate = event.endDate
            ? event.endDate.split("T")[0]
            : "undefined";

          const range: string[] =
            formattedEndDate && formattedEndDate !== formattedStartDate
              ? getDatesInRange(formattedStartDate, formattedEndDate)
              : [formattedStartDate];

          // const eventDates = event.endDate
          //   ? getDatesInRange(event.startDate, event.endDate)
          //   : [event.startDate];

          console.log("range", range);
          range.forEach((date, index, array) => {
            const startTime = event.startTime || "00:00"; // Use event's start time
            const endTime = event.endTime || "23:59"; // Use event's end time

            const timeSlot = `${to24HourTime(startTime)} - ${to24HourTime(
              endTime
            )}`;

            const eventForDate = {
              ...event,
              startDate: date,
              endDate: date,
              startTime,
              endTime,
            };

            if (!newEventsByDateAndTime[date]) {
              newEventsByDateAndTime[date] = {};
            }

            if (!newEventsByDateAndTime[date][timeSlot]) {
              newEventsByDateAndTime[date][timeSlot] = [];
            }

            newEventsByDateAndTime[date][timeSlot].push(eventForDate);
          });
        });

        setEventsByDateAndTime(newEventsByDateAndTime);
      })
      .catch(console.error);
  }, [currentDate]);

  // Populate the eventsByDateAndTime with actual events

  const weekDates = getWeekDates(currentDate);

  const handleEventClick = (eventId: string) => {
    console.log("sending", eventId);
    setSelectedEventId(eventId);
    setModalOpen(true);
  };

  const modalContent = isModalOpen && selectedEventId && (
    <ViewEvent
      eventId={selectedEventId}
      isOpen={isModalOpen}
      onClose={() => setModalOpen(false)}
    />
  );

  const calculateDayHeight = (date: string): number => {
    const dayEvents = eventsByDateAndTime[date] || {};
    let totalHeight = 0;

    Object.entries(dayEvents).forEach(([startTime, events]) => {
      let maxEventHeight = 0;
      events.forEach((event) => {
        maxEventHeight = Math.max(maxEventHeight, calculateHeight(event));
      });
      totalHeight += maxEventHeight;
    });

    return totalHeight;
  };

  return (
    <>
      <div className="flex flex-col">
        {/* Day Names */}
        <div className="flex">
          <div className="w-16" /> {/* Placeholder for time column */}
          {weekDates.map((weekDate) => (
            <div
              key={weekDate.dayOfWeek}
              className="flex-1 text-center py-2 border"
            >
              <div>{weekDate.dayOfWeek}</div>
              <div>{weekDate.date}</div>
            </div>
          ))}
        </div>

        {/* Time Slots and Events */}
        <div className="flex flex-grow">
          {/* Time Column */}
          <div className="w-16">
            {times.map((time) => (
              <div
                key={time}
                className="h-12 border-b flex items-center justify-center text-xs"
              >
                {time}
              </div>
            ))}
          </div>

          {/* {weekDates.map((weekDate, index) => ( */}
          {/*  <div key={weekDate.fullDate} className="flex-1 border-l relative"> */}
          {weekDates.map((weekDate, index) => (
            <div
              key={weekDate.fullDate}
              className="flex-1 border-l relative"
              style={{
                minHeight: `${calculateDayHeight(weekDate.fullDate)}px`,
              }} // Set dynamic height
            >
              {Object.entries(
                eventsByDateAndTime[weekDate.fullDate] || {}
              ).flatMap(([startTime, events]) =>
                events.map((event: Event) => {
                  const [width, left] = calculateWidthAndLeft(event, index);
                  return event.isFullDay ? (
                    // Full-day event styling
                    <div
                      key={event._id}
                      onClick={() => handleEventClick(event._id)}
                      className="text-left text-xs mt-1"
                    >
                      <p className={`text-white p-1 rounded bg-green-600`}>
                        {event.title} - All day
                      </p>
                    </div>
                  ) : (
                    // Timed event styling
                    <p
                      key={event._id}
                      onClick={() => handleEventClick(event._id)}
                      className={`absolute bg-sky-600 text-white text-xs rounded`}
                      style={{
                        top: calculateTop(event) + "px",
                        height: calculateHeight(event) + "px",
                        left: `${left}%`,
                        width: `${width}%`,
                        margin: "1px",
                      }}
                    >
                      {event.title} ({event.startTime || "00:00"} -{" "}
                      {event.endTime || "24:00"})
                    </p>
                  );
                })
              )}
            </div>
          ))}
        </div>
      </div>

      {modalContent &&
        document.getElementById("modal-root") &&
        ReactDOM.createPortal(
          modalContent,
          document.getElementById("modal-root") as Element
        )}
    </>
  );
};

export default Weekly;
