import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@agreejwc/common';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = 'payments-service';

  onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data);

    console.log(data.id);
    console.log(data.userId);
    console.log(data.status);
    console.log(data.expiresAt);
    console.log(data.ticket.id);
    console.log(data.ticket.price);

    msg.ack();
  }
}
