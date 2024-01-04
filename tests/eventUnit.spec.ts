import chai from 'chai';
import { describe, it, beforeEach, afterEach } from 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { Request, Response } from 'express';

import { createEvent } from '../src/controllers/event.controller';
import * as eventService from '../src/services/event.service';
import { expect } from 'chai';

chai.use(sinonChai);

describe('Event Controller - createEvent', () => {
  let req, res, createEventServiceStub, mockedEvent;

  beforeEach(() => {
    // Mock Request and Response
    req = {
      body: {
        title: 'Test Event',
        startDate: '2024-01-02',
        isFullDay: true,
        repeat: 'none',
      },
    } as Partial<Request>;

    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    } as Partial<Response>;

    // Mock Event Service
    mockedEvent = {
      _id: '123',
      title: 'Test Event',
      startDate: '2024-01-02',
      isFullDay: true,
      repeat: 'none',
    };

    createEventServiceStub = sinon.stub(eventService, 'createEventService');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Event Controller - createEvent', () => {
    it('should create a new event and return status 201 with the new event', async () => {
      createEventServiceStub.resolves(mockedEvent);

      await createEvent(req as Request, res as Response);

      expect(createEventServiceStub.calledWith(req.body)).to.be.true;
      expect(res.status).to.have.been.calledWith(201);
      expect(res.send).to.have.been.calledWith(mockedEvent);
    });

    it('should return status 400 if the request body is invalid', async () => {
      req.body.title = 'a';

      await createEvent(req as Request, res as Response);

      expect(res.status).to.have.been.calledWith(400);
      expect(res.send).to.have.been.calledWith(
        '"title" length must be at least 3 characters long'
      );
    });

    it('should handle errors and return status 500', async () => {
      const error = new Error('Internal server error');
      createEventServiceStub.rejects(error);

      await createEvent(req as Request, res as Response);

      expect(createEventServiceStub.calledWith(req.body)).to.be.true;
      expect(res.status).to.have.been.calledWith(500);
      expect(res.send).to.have.been.calledWith('Internal server error');
    });
  });
});
