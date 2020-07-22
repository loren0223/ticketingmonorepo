import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';
import {
  Subjects,
  PaymentCreatedEvent,
  Listener,
  OrderStatus,
  NotFoundError,
} from '@agreejwc/common';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    order.set({ status: OrderStatus.Completed });
    await order?.save();

    msg.ack();
  }
}
