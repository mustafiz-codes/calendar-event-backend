process.env.NODE_ENV = "test";
const chai = require("chai");
const chaiHttp = require("chai-http");
const { app } = require("../index"); // Adjust the path as necessary
const assert = chai.assert;
const faker = require("faker");
const EventModel = require("../models/event.model");

chai.use(chaiHttp);

const server = "http://localhost:5000";

const { deleteAllEvents } = require("../services/event.service");

const _p = require("../helpers/asyncWrapper");

describe("Event test suite", () => {
  beforeEach(async () => {
    await Promise.all([deleteAllEvents()]);
  });

  it("should create an event", async () => {
    const eventData = {
      title: faker.lorem.words(),
      startDate: faker.date.future(),
      isFullDay: faker.datatype.boolean("true"),
      repeat: "none",
    };

    const [err, res] = await _p(
      chai.request(server).post("/events").send(eventData)
    );

    const event = res.body;

    assert.isNull(err, "There should be no error");
    assert.equal(res.status, 201, "Status code should be 201");
    assert.isObject(event, "Response should be an object");
    assert.equal(event.title, eventData.title, "Event title should match");
    assert.equal(
      event.isFullDay,
      eventData.isFullDay,
      "Event isFullDay flag should match"
    );
    assert.exists(event._id, "Event should have an _id");
  });

  it("should get an event with id", async () => {
    const eventData = {
      title: faker.lorem.words(),
      startDate: faker.date.future(),
      isFullDay: faker.datatype.boolean("true"),
      repeat: "none",
    };

    const [err, res] = await _p(
      chai.request(server).post("/events").send(eventData)
    );
    const event = res.body;

    const [err2, res2] = await _p(
      chai.request(server).get(`/events/${event._id}`)
    );

    const getEvent = res2.body;

    assert.isNull(err2, "There should be no error");

    assert.equal(res.status, 201);
    assert.isObject(event, "event should be an object");
    assert.exists(event.startDate, "event date should exist");
    assert.equal(res2.status, 200);
    assert.equal(event.title, getEvent.title, "Event title should match");
    assert.equal(event.startDate, getEvent.startDate);
  });

  it("should update an event with id", async () => {
    const eventData = {
      title: faker.lorem.words(),
      startDate: faker.date.future(),
      isFullDay: faker.datatype.boolean("true"),
      repeat: "none",
    };

    const [err, res] = await _p(
      chai.request(server).post("/events").send(eventData)
    );
    const event = res.body;

    const [err2, res2] = await _p(
      chai
        .request(server)
        .put(`/events/${event._id}`)
        .send({ title: "Updated title" })
    );

    const updatedEvent = res2.body;

    assert.isNull(err2, "There should be no error");
    assert.equal(res2.status, 200);
    assert.equal(updatedEvent.title, "Updated title");
  });

  it("should delete an event with id", async () => {
    const eventData = {
      title: faker.lorem.words(),
      startDate: faker.date.future(),
      isFullDay: faker.datatype.boolean("true"),
      repeat: "none",
    };

    const [err, res] = await _p(
      chai.request(server).post("/events").send(eventData)
    );
    const event = res.body;

    const [err2, res2] = await _p(
      chai.request(server).delete(`/events/${event._id}`)
    );

    assert.isNull(err2, "There should be no error");
    assert.equal(res2.status, 200);

    const [err3, res3] = await _p(
      chai.request(server).get(`/events/${event._id}`)
    );

    assert.equal(res3.status, 404);
  });

  it("should get all events", async () => {
    const eventData = {
      title: faker.lorem.words(),
      startDate: faker.date.future(),
      isFullDay: faker.datatype.boolean("true"),
      repeat: "none",
    };

    const [err, res] = await _p(
      chai.request(server).post("/events").send(eventData)
    );
    const event = res.body;

    const [err2, res2] = await _p(chai.request(server).get("/events"));

    const events = res2.body;

    assert.isNull(err2, "There should be no error");
    assert.equal(res2.status, 200);
    assert.isArray(events, "Events should be an array");
    assert.equal(events.length, 1, "There should be 1 event");
  });

  it("should create events with repeat", async () => {
    const eventData = {
      title: faker.lorem.words(),
      startDate: "2024-01-02",
      isFullDay: faker.datatype.boolean("true"),
      repeat: "monthly",
    };

    const [err, res] = await _p(
      chai.request(server).post("/events").send(eventData)
    );

    const event = res.body;

    const [err2, res2] = await _p(chai.request(server).get("/events"));

    const events = res2.body;

    assert.isNull(err2, "There should be no error");
    assert.equal(res2.status, 200);
    assert.isArray(events, "Events should be an array");
    assert.equal(events.length, 12, "There should be 12 events");
  });

  afterEach(async () => {
    await Promise.all([deleteAllEvents()]);
  });
});
