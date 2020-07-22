import { OrderCreatedListener } from '../order-created-listener';
import { OrderCreatedEvent, OrderStatus } from '@agreejwc/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';

const setup = () => {
  // Create a listener instance
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create a fake data
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date().toISOString(),
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 10,
    },
  };

  // Create a fake message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('create a duplicate order', async () => {
  const { listener, data, msg } = setup();

  // call the onMessage function with data object and message object
  await listener.onMessage(data, msg);

  // write an assertion to make sure the order is created
  const order = await Order.findById(data.id);
  expect(order!.price).toEqual(data.ticket.price);
});

it('ack the message', async () => {
  const { listener, data, msg } = setup();

  // call the onMessage function with data object and message object
  await listener.onMessage(data, msg);

  // write an assertion to make sure the ack() was invoked
  expect(msg.ack).toBeCalled();
});
