"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRecurringEvents = exports.getEventsByRange = exports.deleteRecurringEvents = exports.deleteEventById = exports.updateEventById = exports.getEventById = exports.getAllEvents = exports.createEvent = void 0;
const EventService = __importStar(require("../services/event.service"));
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newEvent = yield EventService.createEventService(req.body);
        res.status(201).send(newEvent);
    }
    catch (error) {
        console.error("Error in POST /events:", error);
        res.status(500).send("Error processing request");
    }
});
exports.createEvent = createEvent;
const getAllEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allEvents = yield EventService.getAllEventsService();
        res.send(allEvents);
    }
    catch (error) {
        console.error("Error in GET /events:", error);
        res.status(500).send("Error processing request");
    }
});
exports.getAllEvents = getAllEvents;
const getEventById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const event = yield EventService.getEventByIdService(id);
        if (event) {
            return res.send(event);
        }
        else {
            return res.status(404).send("Event not found");
        }
    }
    catch (error) {
        console.error("Error in GET /events/:id:", error);
        res.status(500).send("Error processing request");
    }
});
exports.getEventById = getEventById;
const updateEventById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const updatedEvent = yield EventService.updateEventByIdService(id, req.body);
        if (updatedEvent) {
            res.send(updatedEvent);
        }
        else {
            res.status(404).send("Event not found");
        }
    }
    catch (error) {
        console.error("Error in PUT /events/:id:", error);
        res.status(500).send("Error processing request");
    }
});
exports.updateEventById = updateEventById;
const deleteEventById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedEvent = yield EventService.deleteEventByIdService(id);
        if (deletedEvent) {
            res.send({ message: "Event deleted successfully" });
        }
        else {
            res.status(404).send("Event not found");
        }
    }
    catch (error) {
        console.error("Error in DELETE /events/:id:", error);
        res.status(500).send("Error processing request");
    }
});
exports.deleteEventById = deleteEventById;
const deleteRecurringEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { recurringEventId } = req.params;
    try {
        const result = yield EventService.deleteRecurringEventsService(recurringEventId);
        const deletedCount = (_a = result.deletedCount) !== null && _a !== void 0 ? _a : 0; // Provide a fallback of 0 if deletedCount is undefined
        if (deletedCount > 0) {
            res.send({ message: "Recurring events deleted successfully" });
        }
        else {
            res.status(404).send("No recurring events found with the given ID");
        }
    }
    catch (error) {
        console.error("Error in DELETE /events/recurring/:recurringEventId:", error);
        res.status(500).send("Error processing request");
    }
});
exports.deleteRecurringEvents = deleteRecurringEvents;
const getEventsByRange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { start, end } = req.query;
    if (typeof start === "string" && typeof end === "string") {
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (startDate > endDate) {
            return res.status(400).send("End date must be after start date");
        }
        try {
            const filteredEvents = yield EventService.getEventsByRangeService(startDate, endDate);
            res.send(filteredEvents);
        }
        catch (error) {
            console.error("Error in GET /events/range:", error);
            res.status(500).send("Error processing request");
        }
    }
    else {
        res
            .status(400)
            .send("Start and end dates must be provided in the query string");
    }
});
exports.getEventsByRange = getEventsByRange;
const updateRecurringEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { recurringEventId } = req.params;
    const updateData = req.body;
    try {
        const result = yield EventService.updateRecurringEventsService(recurringEventId, updateData);
        const matchedCount = (_b = result.matchedCount) !== null && _b !== void 0 ? _b : 0;
        if (matchedCount > 0) {
            res.send({ message: "Recurring events updated successfully" });
        }
        else {
            res.status(404).send("No recurring events found with the given ID");
        }
    }
    catch (error) {
        console.error("Error in PUT /events/recurring/:recurringEventId:", error);
        res.status(500).send("Error processing request");
    }
});
exports.updateRecurringEvents = updateRecurringEvents;
//# sourceMappingURL=event.controller.js.map