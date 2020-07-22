import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';
import {
  Subjects,
  ExpirationCompletedEvent,
  Listener,
  OrderStatus,
  NotFoundError,
} from '@agreejwc/common';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompletedListener extends Listener<
  ExpirationCompletedEvent
> {
  readonly subject = Subjects.ExpirationCompleted;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompletedEvent['data'], msg: Message) {
    // Find order by id
    const order = await Order.findById(data.orderId).populate('ticket');

    // Throw error if order not found
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Just return & ack message if order status is completed
    if (order.status === OrderStatus.Completed) {
      return msg.ack();
    }

    // Update order status = Cancelled
    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    // Ack the message
    msg.ack();
  }
}
