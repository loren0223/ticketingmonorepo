import { Subjects } from '../../subjects';

export interface ExpirationCompletedEvent {
  subject: Subjects.ExpirationCompleted;
  data: {
    orderId: string;
  };
}
