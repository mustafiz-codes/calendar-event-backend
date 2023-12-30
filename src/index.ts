// index.ts
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDatabase } from "./db/connection"; // Import the connection function
import eventsRouter from "./routes/event.routes";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use("/events", eventsRouter);

// Export the app for use in other files (such as tests)
export { app };

// Can also export the server if we want to control the server in your tests
const server = app
  .listen(port, () => {
    console.log(`Server running on port ${port}`);
    connectDatabase(); // Call the function to connect to the database
  })
  .on("error", (err) => {
    console.error("Error starting server:", err);
  });

// Optionally export the server
export { server };
