import { Subjects, Publisher, PaymentCreatedEvent } from '@agreejwc/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
