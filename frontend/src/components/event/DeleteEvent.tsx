import React, { useState } from "react";

interface DeleteEventModalProps {
  eventId: string;
  isOpen: boolean;

  onDeleteClose: () => void;
  isRecurring: boolean;
  recurringEventId: string;
}

const DeleteEventModal: React.FC<DeleteEventModalProps> = ({
  eventId,
  isOpen,
  onDeleteClose,
  isRecurring,
  recurringEventId,
}) => {
  const [deleteAllRecurring, setDeleteAllRecurring] = useState(false);

  if (!isOpen) return null;

  const handleDeleteConfirm = async () => {
    console.log("recurringEventId", recurringEventId);
    const deleteEndpoint =
      deleteAllRecurring && isRecurring
        ? `http://localhost:5000/events/recurring/${recurringEventId}` // Endpoint for deleting all recurring events
        : `http://localhost:5000/events/${eventId}`; // Endpoint for deleting a single event

    try {
      console.log("deleteEndpoint", deleteEndpoint);
      const response = await fetch(deleteEndpoint, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete event");

      onDeleteClose();
      window.location.reload();
      // Close the modal after successful deletion
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-lg md:text-xl font-bold mb-4">Delete Event</h2>
        <p>Are you sure you want to delete this event?</p>

        {isRecurring && (
          <div className="my-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={deleteAllRecurring}
                onChange={(e) => setDeleteAllRecurring(e.target.checked)}
                className="form-checkbox"
              />
              <span className="ml-2">
                Delete all recurring instances of this event
              </span>
            </label>
          </div>
        )}

        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={handleDeleteConfirm}
            className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </button>
          <button
            onClick={onDeleteClose}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteEventModal;
