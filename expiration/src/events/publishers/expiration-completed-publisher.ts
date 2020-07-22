import {
  Publisher,
  Subjects,
  ExpirationCompletedEvent,
} from '@agreejwc/common';

export class ExpirationCompletedPublisher extends Publisher<
  ExpirationCompletedEvent
> {
  readonly subject = Subjects.ExpirationCompleted;
}
