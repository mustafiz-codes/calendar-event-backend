import React, { useEffect, useState } from "react";
import DeleteEventModal from "./DeleteEvent";
import { to24HourTime } from "../common/common";

interface ViewEventModalProps {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ViewEvent: React.FC<ViewEventModalProps> = ({
  eventId,
  isOpen,
  onClose,
}) => {
  const [viewMode, setViewMode] = useState(true);
  const [isAllDay, setIsAllDay] = useState(false);
  const [isRecurringUpdate, setIsRecurringUpdate] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    notes: "",
    startDate: "",
    endDate: "",
    startTime: "",
    isFullDay: isAllDay,
    endTime: "",
    repeat: "none",
    repeatCycle: 1,
    recurringEventId: "",
  });

  useEffect(() => {
    // Fetch event data based on eventId
    fetch(`http://localhost:5000/events/${eventId}`)
      .then((response) => response.json())
      .then((data) => {
        const formattedStartDate = data.startDate
          ? data.startDate.split("T")[0]
          : "";
        const formattedEndDate = data.endDate ? data.endDate.split("T")[0] : "";
        const formattedStartTime = data.startTime
          ? to24HourTime(data.startTime)
          : "";
        const formattedEndTime = data.endTime ? to24HourTime(data.endTime) : "";

        // Update the eventData and isAllDay state
        setEventData({
          ...data,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          startTime: formattedStartTime,
          endTime: formattedEndTime,
        });

        setIsAllDay(data.isFullDay);
      })
      .catch((error) => console.error("Error fetching event:", error));
  }, [eventId]);

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setEventData((currentEventData) => {
      const newEventData = { ...currentEventData, [name]: value };

      if (name === "startTime") {
        const [hours, minutes] = value.split(":").map(Number);
        const endTimeHour = (hours + 1) % 24; // Use % 24 to handle the case where startTime is 23:00
        const formattedEndTime = `${endTimeHour
          .toString()
          .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

        return {
          ...newEventData,
          endTime:
            currentEventData.endTime === ""
              ? formattedEndTime
              : currentEventData.endTime,
        };
      } else if (name === "startDate" || name === "endDate") {
        if (newEventData.startDate && newEventData.endDate) {
          const start = new Date(newEventData.startDate);
          const end = new Date(newEventData.endDate);

          if (start > end) {
            return {
              ...newEventData,
              startDate:
                name === "endDate"
                  ? newEventData.endDate
                  : newEventData.startDate,
              endDate:
                name === "startDate"
                  ? newEventData.startDate
                  : newEventData.endDate,
            };
          }
        }
      }

      return newEventData;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Add validation logic here if needed

    event.preventDefault();

    if (eventData.startDate === null || eventData.startDate === "") {
      alert("Please enter a start date");
      return;
    }

    if (eventData.endDate === null || eventData.endDate === "") {
      eventData.endDate = eventData.startDate;
    }
    const timeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (
      !isAllDay &&
      (!timeFormat.test(eventData.startTime) ||
        !timeFormat.test(eventData.endTime))
    ) {
      alert("Please enter time in HH:MM format.");
      return;
    }

    if (eventData.repeatCycle < 1) {
      eventData.repeatCycle = 1;
      alert("repeatCycle can't be less then 1");
    }

    const [startHours, startMinutes] = eventData.startTime
      .split(":")
      .map(Number);
    const [endHours, endMinutes] = eventData.endTime.split(":").map(Number);

    if (
      endHours < startHours ||
      (endHours === startHours && endMinutes < startMinutes)
    ) {
      alert("End time cannot be before start time.");
      return;
    }

    if (isRecurringUpdate) {
      const originalData = await fetch(
        `http://localhost:5000/events/${eventId}`
      ).then((response) => response.json());

      // Check if any restricted fields have been modified
      if (
        eventData.startDate !== originalData.startDate ||
        eventData.endDate !== originalData.endDate ||
        eventData.repeat !== originalData.repeat ||
        eventData.repeatCycle !== originalData.repeatCycle ||
        eventData.recurringEventId !== originalData.recurringEventId
      ) {
        alert(
          "You can only update title, description, notes, time, and isFullDay for recurring events."
        );
        return;
      }
    }

    try {
      if (!isRecurringUpdate) {
        const response = await fetch(
          `http://localhost:5000/events/${eventId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(eventData),
          }
        );

        window.location.reload();
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error in response:", errorData);
          throw new Error("Failed to create event");
        }
      } else {
        const response = await fetch(
          `http://localhost:5000/events/recurring/${eventData.recurringEventId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(eventData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error in response:", errorData);
          throw new Error("Failed to update recurring event");
        }

        window.location.reload();
      }

      onClose(); // Close the modal
    } catch (error) {
      console.error("Error in creating/updating event:", error);
    }
  };

  if (!isOpen) return null;

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-xl w-full max-w-2xl">
          <h2 className="text-lg md:text-xl font-bold mb-4">Event Details</h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 max-h-[70vh] overflow-y-auto"
          >
            <input
              type="text"
              name="title"
              placeholder="Add title"
              required
              value={eventData.title}
              disabled={viewMode}
              className="px-4 py-2 border rounded"
              onChange={handleInputChange}
            />
            <textarea
              name="description"
              placeholder="Description"
              value={eventData.description}
              disabled={viewMode}
              className="px-4 py-2 border rounded"
              onChange={handleInputChange}
            />
            <textarea
              name="notes"
              placeholder="Note"
              value={eventData.notes}
              disabled={viewMode}
              className="px-4 py-2 border rounded"
              onChange={handleInputChange}
            />
            <div className="flex justify-between gap-4">
              <div className="w-full">
                <label className="block">
                  <span className="text-gray-700">Start Date</span>
                  <input
                    type="date"
                    name="startDate"
                    value={eventData.startDate}
                    disabled={viewMode}
                    className="mt-1 px-4 py-2 border rounded w-full"
                    onChange={handleInputChange}
                  />
                </label>
              </div>
              <div className="w-full">
                <label className="block">
                  <span className="text-gray-700">End Date</span>
                  <input
                    type="date"
                    name="endDate"
                    value={eventData.endDate}
                    disabled={viewMode}
                    className="mt-1 px-4 py-2 border rounded w-full"
                    onChange={handleInputChange}
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isAllDay}
                disabled={viewMode}
                onChange={(e) => {
                  setIsAllDay(e.target.checked);
                  setEventData({ ...eventData, isFullDay: e.target.checked });
                }}
                className="rounded "
              />
              <span>All day</span>
            </div>
            {!isAllDay && (
              <div className="flex justify-between gap-4">
                <div className="w-full">
                  <label className="block">
                    <span className="text-gray-700">Start Time</span>
                    <input
                      type="time"
                      name="startTime"
                      value={eventData.startTime}
                      disabled={viewMode}
                      className="px-4 py-2 border rounded w-full"
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div className="w-full">
                  <label className="block">
                    <span className="text-gray-700">End Time</span>
                    <input
                      type="time"
                      name="endTime"
                      value={eventData.endTime}
                      disabled={viewMode}
                      className="px-4 py-2 border rounded w-full"
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
              </div>
            )}
            <div className="w-full">
              <label className="block">
                <span className="text-gray-700">Repeat</span>
                <select
                  name="repeat"
                  className="px-4 py-2 border rounded w-full"
                  value={eventData.repeat}
                  disabled={viewMode}
                  onChange={handleInputChange}
                >
                  <option value="none">Does not repeat</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </label>
            </div>

            {eventData.repeat !== "none" && (
              <div className="w-full">
                <label className="block">
                  <span className="text-gray-700">Repeat Cycle</span>
                  <input
                    type="number"
                    name="repeatCycle"
                    className="px-4 py-2 border rounded w-full"
                    value={eventData.repeatCycle}
                    disabled={viewMode}
                    onChange={handleInputChange}
                  ></input>
                </label>
              </div>
            )}

            {eventData?.recurringEventId && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  disabled={viewMode}
                  onChange={(e) => setIsRecurringUpdate(e.target.checked)}
                  className="rounded "
                />
                <span>Update All Recurring Events</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setViewMode(false);
              }}
              disabled={!viewMode}
              className={`${
                viewMode ? "cursor-pointer" : "cursor-not-allowed opacity-50"
              } bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded`}
            >
              Edit Event
            </button>

            <button
              type="submit"
              disabled={viewMode}
              className={`${
                !viewMode ? "cursor-pointer" : "cursor-not-allowed opacity-50"
              }" bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded`}
            >
              Update Event
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-700 hover:bg-red-900 text-white font-bold py-2 px-4 rounded"
            >
              Delete Event
            </button>

            <button
              type="button" // Add this to prevent the default submit behavior
              onClick={onClose}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </form>
        </div>
      </div>

      {isDeleteModalOpen && (
        <DeleteEventModal
          eventId={eventId}
          isOpen={isDeleteModalOpen}
          onDeleteClose={() => setDeleteModalOpen(false)}
          isRecurring={!!eventData.recurringEventId} // Assuming you have a way to determine if the event is recurring
          recurringEventId={eventData.recurringEventId} // Assuming this is the ID for recurring events
        />
      )}
    </>
  );
};
export default ViewEvent;
