import { Subjects } from '../../subjects';

export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    version: number;
    category: string;
    title: string;
    price: number;
    userId: string;
  };
}
