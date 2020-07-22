import { Subjects, Publisher, TicketCreatedEvent } from '@agreejwc/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
