"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRecurringEventsService = exports.getEventsByRangeService = exports.deleteRecurringEventsService = exports.deleteEventByIdService = exports.updateEventByIdService = exports.getEventByIdService = exports.getAllEventsService = exports.createEventService = void 0;
const uuid_1 = require("uuid");
const generateRepeatingEvents_1 = require("../../src/helpers/generateRepeatingEvents");
const event_model_1 = __importDefault(require("../models/event.model"));
const createEventService = (eventData) => __awaiter(void 0, void 0, void 0, function* () {
    eventData._id = (0, uuid_1.v4)();
    const newEvent = new event_model_1.default(eventData);
    yield newEvent.save();
    if (eventData.repeat !== "none") {
        const additionalEvents = (0, generateRepeatingEvents_1.generateRepeatingEvents)(eventData);
        yield event_model_1.default.insertMany(additionalEvents);
    }
    return newEvent;
});
exports.createEventService = createEventService;
// Get all events
const getAllEventsService = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield event_model_1.default.find({});
});
exports.getAllEventsService = getAllEventsService;
// Get event by ID
const getEventByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield event_model_1.default.findById(id);
});
exports.getEventByIdService = getEventByIdService;
// Update event by ID
const updateEventByIdService = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield event_model_1.default.findByIdAndUpdate(id, updateData, { new: true });
});
exports.updateEventByIdService = updateEventByIdService;
// Delete event by ID
const deleteEventByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Perform the deletion operation
    const result = yield event_model_1.default.findByIdAndDelete(id);
    // Check if a document was found and deleted
    if (result && result.toJSON) {
        return result.toJSON();
    }
    else {
        return null;
    }
});
exports.deleteEventByIdService = deleteEventByIdService;
// Delete recurring events
const deleteRecurringEventsService = (recurringEventId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield event_model_1.default.deleteMany({ recurringEventId });
});
exports.deleteRecurringEventsService = deleteRecurringEventsService;
// Get events by date range
const getEventsByRangeService = (start, end) => __awaiter(void 0, void 0, void 0, function* () {
    return yield event_model_1.default.find({
        startDate: { $gte: start },
        endDate: { $lte: end },
    });
});
exports.getEventsByRangeService = getEventsByRangeService;
// Update recurring events
const updateRecurringEventsService = (recurringEventId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield event_model_1.default.updateMany({ recurringEventId }, { $set: updateData }, { new: true });
});
exports.updateRecurringEventsService = updateRecurringEventsService;
//# sourceMappingURL=event.service.js.map