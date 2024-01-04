import { model } from 'mongoose';
import { IEvent } from '../db/event.interface'; // Relative path to event.interface.ts
import eventSchema from '../db/event.schema'; // Relative path to event.schema.ts

const EventModel = model<IEvent>('Event', eventSchema);

export default EventModel;
