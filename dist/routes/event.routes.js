"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const event_controller_1 = require("../controllers/event.controller");
const router = express_1.default.Router();
router.post("/", event_controller_1.createEvent);
router.get("/", event_controller_1.getAllEvents);
router.get("/:id", event_controller_1.getEventById);
router.get("/range", event_controller_1.getEventsByRange);
router.put("/:id", event_controller_1.updateEventById);
router.put("/:recurringEventId", event_controller_1.updateRecurringEvents);
router.delete("/:id", event_controller_1.deleteEventById);
router.delete("/:recurringEventId", event_controller_1.deleteRecurringEvents);
exports.default = router;
//# sourceMappingURL=event.routes.js.map