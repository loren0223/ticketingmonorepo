import { TicketCreatedListener } from '../ticket-created-listener';
import { TicketCreatedEvent } from '@agreejwc/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';

const setup = () => {
  // Create a listener instance
  const listener = new TicketCreatedListener(natsWrapper.client);

  // Create a fake data
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'movie',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // Create a fake message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('create a ticket and save', async () => {
  const { listener, data, msg } = setup();

  // call the onMessage function with data object and message object
  await listener.onMessage(data, msg);

  // write an assertion to make sure the ticket was created
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.version).toEqual(0);
});

it('ack the message', async () => {
  const { listener, data, msg } = setup();

  // call the onMessage function with data object and message object
  await listener.onMessage(data, msg);

  // write an assertion to make sure the ack() was invoked
  expect(msg.ack).toBeCalled();
});
