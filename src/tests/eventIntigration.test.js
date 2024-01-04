import chai from 'chai';
import chaiHttp from 'chai-http';
import assert from 'chai';
import faker from 'faker';
import { deleteAllEvents } from '../services/event.service';
import _p from '../helpers/asyncWrapper';

chai.use(chaiHttp);

const server = 'http://localhost:5000';

describe('Event test suite', () => {
  beforeEach(async () => {
    await Promise.all([deleteAllEvents()]);
  });

  it('should create an event', async () => {
    const eventData = {
      title: faker.lorem.words(),
      startDate: faker.date.future(),
      isFullDay: true,
      repeat: 'none',
    };

    const [err, res] = await _p(
      chai.request(server).post('/events').send(eventData)
    );

    const event = res.body;

    assert.isNull(err, 'There should be no error');
    assert.equal(res.status, 201, 'Status code should be 201');
    assert.isObject(event, 'Response should be an object');
    assert.equal(event.title, eventData.title, 'Event title should match');
    assert.equal(
      event.isFullDay,
      eventData.isFullDay,
      'Event isFullDay flag should match'
    );
    assert.exists(event._id, 'Event should have an _id');
  });

  it('should get an event with id', async () => {
    const eventData = {
      title: faker.lorem.words(),
      startDate: faker.date.future(),
      isFullDay: true,
      repeat: 'none',
    };

    const [, res] = await _p(
      chai.request(server).post('/events').send(eventData)
    );
    const event = res.body;

    const [err2, res2] = await _p(
      chai.request(server).get(`/events/${event._id}`)
    );

    const getEvent = res2.body;

    assert.isNull(err2, 'There should be no error');

    assert.equal(res.status, 201);
    assert.isObject(event, 'event should be an object');
    assert.exists(event.startDate, 'event date should exist');
    assert.equal(res2.status, 200);
    assert.equal(event.title, getEvent.title, 'Event title should match');
    assert.equal(event.startDate, getEvent.startDate);
  });

  it('should update an event with id', async () => {
    const eventData = {
      title: faker.lorem.words(),
      startDate: faker.date.future(),
      isFullDay: true,
      repeat: 'none',
    };

    const [, res] = await _p(
      chai.request(server).post('/events').send(eventData)
    );
    const event = res.body;

    const [err2, res2] = await _p(
      chai
        .request(server)
        .put(`/events/${event._id}`)
        .send({ title: 'Updated title' })
    );

    const updatedEvent = res2.body;

    assert.isNull(err2, 'There should be no error');
    assert.equal(res2.status, 200);
    assert.equal(updatedEvent.title, 'Updated title');
  });

  it('should delete an event with id', async () => {
    const eventData = {
      title: faker.lorem.words(),
      startDate: faker.date.future(),
      isFullDay: true,
      repeat: 'none',
    };

    const [, res] = await _p(
      chai.request(server).post('/events').send(eventData)
    );
    const event = res.body;

    const [err2, res2] = await _p(
      chai.request(server).delete(`/events/${event._id}`)
    );

    assert.isNull(err2, 'There should be no error');
    assert.equal(res2.status, 200);

    const [, res3] = await _p(chai.request(server).get(`/events/${event._id}`));

    assert.equal(res3.status, 404);
  });

  it('should get all events', async () => {
    const [err, res] = await _p(chai.request(server).get('/events'));

    const events = res.body;

    assert.isNull(err, 'There should be no error');
    assert.equal(res.status, 200);
    assert.isArray(events, 'Events should be an array');
    assert.equal(events.length, 1, 'There should be 1 event');
  });

  afterEach(async () => {
    await Promise.all([deleteAllEvents()]);
  });
});
