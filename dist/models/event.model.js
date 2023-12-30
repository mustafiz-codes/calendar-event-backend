"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const event_schema_1 = __importDefault(require("../db/event.schema")); // Relative path to event.schema.ts
const EventModel = (0, mongoose_1.model)("Event", event_schema_1.default);
exports.default = EventModel;
//# sourceMappingURL=event.model.js.map