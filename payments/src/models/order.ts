import mongoose from 'mongoose';
import { OrderStatus } from '@agreejwc/common';

// Define the object types
interface OrderAttrs {
  id: string;
  version: number;
  status: OrderStatus;
  userId: string;
  price: number;
}

interface OrderDoc extends mongoose.Document {
  version: number;
  status: OrderStatus;
  userId: string;
  price: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
  findByEvent(event: { id: string; version: number }): Promise<OrderDoc | null>;
}

// Define the model schema
const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
    },
    userId: {
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
orderSchema.set('versionKey', 'version');

orderSchema.pre('save', function (done) {
  // @ts-ignore
  this.$where = {
    version: this.get('version') - 1, // Change the decrements according to Version Schema
  };

  done();
});

// Schema static methods
orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    status: attrs.status,
    price: attrs.price,
    userId: attrs.userId,
  });
};

orderSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Order.findOne({
    _id: event.id,
    version: event.version - 1, // Change the decrements according to Version Schema
  });
};

// Define the model
const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
