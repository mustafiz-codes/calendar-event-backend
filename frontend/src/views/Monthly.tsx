import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import GenerateCalendar from "../components/datePicker/GenerateCalendar";
import { useCalendar } from "../context/CalendarContext";
import { getDatesInRange } from "../components/common/common";
import ViewEvent from "../components/event/ViewEvent";

const MonthlyView = () => {
  const { currentDate } = useCalendar();
  const calendarDays = GenerateCalendar(currentDate);
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/events")
      .then((response) => response.json())
      .then((data: Event[]) => {
        const newEvents: EventsByDate = data.reduce(
          (acc: EventsByDate, event: Event) => {
            // Convert startDate and endDate to 'YYYY-MM-DD' format
            const formattedStartDate = event.startDate.split("T")[0];
            const formattedEndDate = event.endDate
              ? event.endDate.split("T")[0]
              : undefined;

            const range: string[] =
              formattedEndDate && formattedEndDate !== formattedStartDate
                ? getDatesInRange(formattedStartDate, formattedEndDate)
                : [formattedStartDate];

            range.forEach((date) => {
              if (!acc[date]) {
                acc[date] = [];
              }
              acc[date].push({
                ...event,
                startDate: date, // Already formatted above
                endDate: formattedEndDate, // Apply the formatted endDate
                ...(event.isFullDay
                  ? { startTime: undefined, endTime: undefined }
                  : {}),
              });
            });

            return acc;
          },
          {}
        );

        setEvents(Object.values(newEvents).flat());
      })
      .catch(console.error);
  }, []);

  interface CalendarDay {
    date: number;
    isToday: boolean;
    fullDate: string;
    currentMonth: boolean;
    day: string;
  }

  interface EventsByDate {
    [date: string]: Event[];
  }

  interface Event {
    _id: string;
    title: string;
    description?: string;
    startDate: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    isFullDay: boolean;
    repeat?: "none" | "daily" | "weekly" | "monthly" | "yearly";
    repeatCycle?: number;
  }

  const handleEventClick = (eventId: string) => {
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
  return (
    <>
      <div className="rounded-lg shadow h-full mb-12 overflow-hidden">
        <div className="grid grid-cols-7 text-center border-b">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="px-4 py-2 font-medium">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 h-full border-b">
          {calendarDays.map((day: CalendarDay, index: number) => (
            <div
              key={index}
              className={`p-4 w-full text-center border ${
                !day.currentMonth && "text-gray-400"
              }`}
            >
              <div
                className={`text-sm ${
                  day.isToday
                    ? "border-2 border-sky-600 rounded-3xl text-center"
                    : ""
                } ${day.isToday && "font-semibold"}`}
              >
                {day.date}
              </div>
              {events.find(
                (event) =>
                  event.startDate === day.fullDate ||
                  event.endDate === day.fullDate
              ) &&
                events
                  .filter((event) => event.startDate === day.fullDate)
                  .map((event, idx) => (
                    <div
                      key={`${event._id}-${idx}`}
                      onClick={() => handleEventClick(event._id)}
                      className="text-left text-xs mt-1"
                    >
                      <p
                        className={`text-white p-1 rounded ${
                          event.isFullDay ? "bg-green-600" : "bg-sky-600"
                        }`}
                      >
                        {event.title} -{" "}
                        {event.isFullDay
                          ? "All day"
                          : `${event.startTime || "Start"} to ${
                              event.endTime || "End"
                            }`}
                      </p>
                    </div>
                  ))}
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

export default MonthlyView;
