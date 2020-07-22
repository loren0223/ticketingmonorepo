import { Publisher, OrderCancelledEvent, Subjects } from '@agreejwc/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
