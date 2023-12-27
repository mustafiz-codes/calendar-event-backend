import express from "express";

const router = express.Router();

const events = [
  {
    id: 1,
    title: "Office meeting",
    description: "string",
    notes: "string",
    startDate: "Date",
    endDate: "Date",
    isFullDay: true,
    startTime: "string",
    endTime: "string",
    repeat: "none",
    repeatCycle: "number",
  },
  {
    id: 2,
    title: "React Meet Up",
    description: "string",
    notes: "string",
    startDate: "Date",
    endDate: "Date",
    isFullDay: true,
    startTime: "string",
    endTime: "string",
    repeat: "none",
    repeatCycle: "number",
  },
];

router.get("/", (req, res) => {
  console.log(events);
  res.send(events);
});

router.post("/", (req, res) => {

    events.push
  res.send("events added");
});

export default router;
