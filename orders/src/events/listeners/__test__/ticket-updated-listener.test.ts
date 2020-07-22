import { Message } from 'node-nats-streaming';
import { TicketUpdatedEvent } from '@agreejwc/common';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';

const setup = async () => {
  // Create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // Create a ticket and save
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'movie',
    price: 99,
    version: 0,
  });
  await ticket.save();

  // Create a fake data
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: 1,
    title: 'movie',
    price: 88.8,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // Create a fake message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all the objects
  return { listener, data, msg };
};

it('Find, update and save the ticket', async () => {
  const { listener, data, msg } = await setup();

  // Call the onMessage function with data and message objects
  await listener.onMessage(data, msg);

  // write an assertion to make sure the ticket was updated
  const ticket = await Ticket.findById(data.id);
  expect(ticket!.version).toEqual(1);
  expect(ticket!.price).toEqual(88.8);
});

it('Ack the message', async () => {
  const { listener, data, msg } = await setup();

  // Call the onMessage function with data and message objects
  await listener.onMessage(data, msg);

  // Write an assertion to make sure the ack function was invoked
  expect(msg.ack).toBeCalled();
});

it('throw an error if the event has a skipped version number', async () => {
  const { listener, data, msg } = await setup();

  // Increments the version number
  data.version = data.version + 1;

  // Call the onMessage function with data and message objects
  try {
    await listener.onMessage(data, msg);
  } catch (err) {
    expect(err.message).toEqual('Ticket not found');
    expect(msg.ack).not.toBeCalled();
    return;
  }

  throw new Error('Should not reach this line');
});
