const chai = require("chai");
const chaiHttp = require("chai-http");
const { describe, it, afterEach } = require("mocha");
const sinon = require("sinon");
const { v4: uuidv4 } = require("uuid");
const sinonChai = require("sinon-chai");

chai.use(sinonChai);
const { expect } = chai;

const EventService = require("../services/event.service");
const { assert } = require("console");
const e = require("express");
const faker = require("faker");

const {
  createEvent,
  getAllEvents,
} = require("../controllers/event.controller");

describe("Event Controller Unit Tests", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("createEvent", () => {
    it("should create a new event and return status 201 with the new event", async () => {
      const req = {
        body: {
          title: faker.lorem.words(),
          startDate: "2024-01-02",
          isFullDay: faker.datatype.boolean("true"),
          repeat: "none",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
      };
      const newEvent = {
        // provide the new event data
      };
      sinon.stub(EventService, "createEventService").resolves(newEvent);

      await createEvent(req, res);

      expect(EventService.createEventService).to.have.been.calledWith(req.body);
      expect(res.status).to.have.been.calledWith(201);
      expect(res.send).to.have.been.calledWith(newEvent);
    });

    it("should handle errors and return status 500 with an error message", async () => {
      const req = {
        body: {
          title: faker.lorem.words(),
          startDate: "2024-01-02",
          isFullDay: faker.datatype.boolean("true"),
          repeat: "none",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
      };
      const error = new Error("Some error message");
      sinon.stub(EventService, "createEventService").rejects(error);
      sinon.stub(console, "error");
      await createEvent(req, res);
      expect(EventService.createEventService).to.have.been.calledWith(req.body);
      expect(console.error).to.have.been.calledWith(
        "Error in POST /events:",
        error
      );
      expect(res.status).to.have.been.calledWith(500);
      expect(res.send).to.have.been.calledWith("Error processing request");
    });
  });

  describe("getAllEvents", () => {
    it("should get all events and return status 200 with the events", async () => {
      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
      };
      const events = [
        {
          _id: uuidv4(),
          title: faker.lorem.words(),
          startDate: "2024-01-02",
          isFullDay: faker.datatype.boolean("true"),
          repeat: "none",
        },
      ];
      sinon.stub(EventService, "getAllEventsService").resolves(events);

      await getAllEvents(req, res);

      expect(EventService.getAllEventsService).to.have.been.called;
      expect(res.send).to.have.been.calledWith(events);
    });

    it("should handle errors and return status 500", async () => {
      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
      };
      const error = new Error("Some error message");
      sinon.stub(EventService, "getAllEventsService").rejects(error);

      await getAllEvents(req, res);

      expect(EventService.getAllEventsService).to.have.been.called;
      expect(res.status).to.have.been.calledWith(500);
      expect(res.send).to.have.been.calledWith("Error processing request");
    });
  });
});
