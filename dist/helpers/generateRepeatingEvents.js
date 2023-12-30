"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRepeatingEvents = void 0;
const uuid_1 = require("uuid");
function generateRepeatingEvents(eventData) {
    let events = [];
    let nextDate = new Date(eventData.startDate);
    const endDate = new Date(eventData.startDate);
    endDate.setFullYear(endDate.getFullYear() + 1); // 1 year from start date
    // Destructure only the necessary fields from eventData
    const { title, description, notes, isFullDay, startTime, endTime, repeat, repeatCycle, } = eventData;
    const recurringEventId = eventData._id;
    while (nextDate < endDate) {
        nextDate = new Date(nextDate); // Clone date to avoid mutation
        // Calculate the next occurrence date
        switch (eventData.repeat) {
            case "daily":
                nextDate.setDate(nextDate.getDate() + 1);
                break;
            case "weekly":
                nextDate.setDate(nextDate.getDate() + 7);
                break;
            case "monthly":
                nextDate.setMonth(nextDate.getMonth() + 1);
                break;
            case "yearly":
                nextDate.setFullYear(nextDate.getFullYear() + 1);
                break;
        }
        if (nextDate < endDate) {
            const newEvent = {
                _id: (0, uuid_1.v4)(),
                recurringEventId,
                title,
                description,
                notes,
                startDate: nextDate,
                endDate: eventData.endDate, // Or calculate based on repeat pattern
                isFullDay,
                startTime,
                endTime,
                repeat,
                repeatCycle,
            };
            events.push(newEvent);
        }
    }
    return events;
}
exports.generateRepeatingEvents = generateRepeatingEvents;
//# sourceMappingURL=generateRepeatingEvents.js.map