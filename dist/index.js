"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
// index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const connection_1 = require("./db/connection"); // Import the connection function
const event_routes_1 = __importDefault(require("./routes/event.routes"));
const app = (0, express_1.default)();
exports.app = app;
const port = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Hello, world!");
});
app.use("/events", event_routes_1.default);
// Can also export the server if we want to control the server in your tests
const server = app
    .listen(port, () => {
    console.log(`Server running on port ${port}`);
    (0, connection_1.connectDatabase)(); // Call the function to connect to the database
})
    .on("error", (err) => {
    console.error("Error starting server:", err);
});
exports.server = server;
//# sourceMappingURL=index.js.map