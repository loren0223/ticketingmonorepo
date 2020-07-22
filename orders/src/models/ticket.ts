import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
  version: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  createdAt: string;
  updatedAt: string;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(input: TicketAttrs): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// Schema configuration
ticketSchema.set('versionKey', 'version');
ticketSchema.pre('save', function (done) {
  // @ts-ignore
  this.$where = {
    version: this.get('version') - 1, // Change the decrements according to Version Schema
  };

  done();
});

// Schema static methods
ticketSchema.statics.build = (input: TicketAttrs) => {
  return new Ticket({
    _id: input.id,
    version: input.version,
    title: input.title,
    price: input.price,
  });
};
ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1, // Change the decrements according to Version Schema
  });
};

// Document instance methods
ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.AwaitPayment,
        OrderStatus.Completed,
        OrderStatus.Created,
      ],
    },
  });

  // return existingOrder ? true : false;
  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
