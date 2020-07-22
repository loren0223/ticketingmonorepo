import { Subjects, Listener, OrderCreatedEvent } from '@agreejwc/common';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      version: data.version,
      status: data.status,
      price: data.ticket.price,
      userId: data.userId,
    });
    await order.save();

    msg.ack();
  }
}
