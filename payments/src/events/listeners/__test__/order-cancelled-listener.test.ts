import { OrderCancelledListener } from '../order-cancelled-listener';
import { OrderCancelledEvent, OrderStatus } from '@agreejwc/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';

const setup = async () => {
  // Create a listener instance
  const listener = new OrderCancelledListener(natsWrapper.client);

  // Create a order
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 100,
  });
  await order.save();

  // Create a fake data
  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: order.version + 1, // Change the increments according to Version Schema
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
    },
  };

  // Create a fake message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('Cancel the order', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with data object and message object
  await listener.onMessage(data, msg);

  // write an assertion to make sure the ticket was created
  const order = await Order.findById(data.id);
  expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it('ack the message', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with data object and message object
  await listener.onMessage(data, msg);

  // write an assertion to make sure the ack() was invoked
  expect(msg.ack).toBeCalled();
});
