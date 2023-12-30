"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const eventSchema = new mongoose_1.Schema({
    _id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: false },
    notes: { type: String, required: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false },
    isFullDay: { type: Boolean, required: true },
    startTime: { type: String, required: false }, // Could be 'HH:mm' format
    endTime: { type: String, required: false }, // Could be 'HH:mm' format
    repeat: {
        type: String,
        enum: ["none", "daily", "weekly", "monthly", "yearly"],
        default: "none",
    },
    repeatCycle: { type: Number, required: false }, // Used for biweekly, etc.
});
exports.default = eventSchema;
//# sourceMappingURL=event.schema.js.map