import { Subjects } from '../../subjects';

export interface TicketUpdatedEvent {
  subject: Subjects.TicketUpdated;
  data: {
    id: string;
    version: number;
    category: string;
    title: string;
    price: number;
    userId: string;
    orderId?: string;
  };
}
