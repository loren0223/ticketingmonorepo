import { Subjects, Publisher, TicketUpdatedEvent } from '@agreejwc/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
