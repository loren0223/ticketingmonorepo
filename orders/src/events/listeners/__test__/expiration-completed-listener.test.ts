import { ExpirationCompletedListener } from '../expiration-completed-listener';
import { ExpirationCompletedEvent, OrderStatus } from '@agreejwc/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';

const setup = async () => {
  // Create a listener instance
  const listener = new ExpirationCompletedListener(natsWrapper.client);

  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'movie',
    price: 10,
    version: 0,
  });
  await ticket.save();

  // Create an order
  const order = Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  // Create a fake data
  const data: ExpirationCompletedEvent['data'] = {
    orderId: order.id,
  };

  // Create a fake message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, order, data, msg };
};

it('mark the order as cancelled', async () => {
  const { listener, ticket, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  // Order to be cancelled
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

  // Publish order-cancelled event
  expect(natsWrapper.client.publish).toBeCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);

  // Ack the message
  expect(msg.ack).toBeCalled();
});
