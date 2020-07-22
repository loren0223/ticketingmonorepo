import { Publisher, TicketCreatedEvent, Subjects } from '@agreejwc/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
