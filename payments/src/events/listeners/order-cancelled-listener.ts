import {
  Subjects,
  Listener,
  OrderCancelledEvent,
  NotFoundError,
  OrderStatus,
} from '@agreejwc/common';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findByEvent(data);

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    order.set({
      status: OrderStatus.Cancelled,
      version: data.version,
    });
    await order.save();

    msg.ack();
  }
}
