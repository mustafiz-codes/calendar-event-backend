import express from "express";
import {
  createEvent,
  deleteEventById,
  getAllEvents,
  getEventById,
  getEventsByRange,
  updateEventById,
} from "../../controllers/events";

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/", createEvent);
router.put("/:id", updateEventById);
router.delete("/:id", deleteEventById);
router.get("/range", getEventsByRange);

export default router;
