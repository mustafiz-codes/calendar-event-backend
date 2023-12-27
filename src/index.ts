import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import eventsRouter from "./routes/events"; // Adjust the path to where your events.ts file is

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use("/events", eventsRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
