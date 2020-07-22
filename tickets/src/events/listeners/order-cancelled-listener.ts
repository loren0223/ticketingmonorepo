import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../model/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import {
  Subjects,
  Listener,
  OrderCancelledEvent,
  NotFoundError,
} from '@agreejwc/common';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // Find the ticket that order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If not found, throw error
    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    // Mark the ticket as not being reserved by setting the orderId property
    ticket.set({ orderId: undefined });

    // Save the ticket
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });

    // Ack the message
    msg.ack();
  }
}
