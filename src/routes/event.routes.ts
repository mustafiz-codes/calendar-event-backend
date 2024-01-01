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
} from "../controllers/event.controller";

const router = express.Router();

router.post("/", createEvent); //issue

router.get("/", getAllEvents);
router.get("/range", getEventsByRange);
router.get("/:id", getEventById);

router.put("/:id", updateEventById);
router.put("/recurring/:recurringEventId", updateRecurringEvents);

router.delete("/:id", deleteEventById);
router.delete("/recurring/:recurringEventId", deleteRecurringEvents);

export default router;
