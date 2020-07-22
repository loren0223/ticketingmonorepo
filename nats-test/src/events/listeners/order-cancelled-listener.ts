import { Message } from 'node-nats-streaming';
import { Listener, OrderCancelledEvent, Subjects } from '@agreejwc/common';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = 'payments-service';

  onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    console.log('Event data!', data);

    console.log(data.id);
    console.log(data.ticket.id);

    msg.ack();
  }
}
