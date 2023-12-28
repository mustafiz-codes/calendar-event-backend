import express from "express";
import cors from "cors";
import morgan from "morgan";
import eventsRouter from "./routes/events";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use("/events", eventsRouter);

app
  .listen(port, () => {
    console.log(`Server running on port ${port}`);
  })
  .on("error", (err) => {
    console.error("Error starting server:", err);
  });

mongoose.Promise = Promise;

if (!process.env.MONGO_URL) {
  console.error("The MONGO_URL must be defined in the .env file");
  process.exit(1); // Exit the process with an error code
}
const MONGO_URL = process.env.MONGO_URL || "";

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

mongoose.connection.on("error", (error: Error) => console.log(error));
