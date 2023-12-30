const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require("faker");
const { app } = require("../../dist/index");

const expect = chai.expect; // Add this line

chai.use(chaiHttp);

describe("Event API End-to-End Tests", () => {
  it("should create a new event with fake data", async () => {
    const fakeEvent = {
      title: faker.lorem.sentence(),
      startDate: faker.date.future(),
      endDate: faker.date.future(),
      isFullDay: faker.random.boolean(),
      repeat: faker.random.arrayElement([
        "none",
        "daily",
        "weekly",
        "monthly",
        "yearly",
      ]),
      // ...other event fields
    };

    const response = await chai.request(app).post("/events").send(fakeEvent);
    expect(response.status).to.equal(201);
    expect(response.body).to.include.keys(
      "_id",
      "title",
      "startDate",
      "isFullDay",
      "repeat"
    );

    expect(response.body.title).to.equal(fakeEvent.title);
    // ...other assertions
  });

  // ...other tests...
});
