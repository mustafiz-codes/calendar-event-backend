// index.ts
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDatabase } from "./db/connection";
import eventsRouter from "./routes/event.routes";
import swaggerUI from "swagger-ui-express";
import swaggerDocument from "./docs/swagger.json";

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send(
    `Database connected! check API docs at http://localhost:5000/api-docs`
  );
});

app.use("/events", eventsRouter);

app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument, {
    explorer: true,
  })
);

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
module.exports = app;
