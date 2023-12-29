import express from "express";
import {
  createEvent,
  deleteEventById,
  deleteRecurringEvents,
  getAllEvents,
  getEventById,
  getEventsByRange,
  updateEventById,
  updateRecurringEvents,
} from "../../controllers/events";

const router = express.Router();

router.post("/", createEvent);

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.get("/range", getEventsByRange);

router.put("/:id", updateEventById);
router.put("/:recurringEventId", updateRecurringEvents);

router.delete("/:id", deleteEventById);
router.delete("/:recurringEventId", deleteRecurringEvents);

export default router;
