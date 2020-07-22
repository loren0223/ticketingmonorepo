import mongoose from 'mongoose';

// Define the types
interface PaymentAttrs {
  orderId: string;
  chargeId: string;
}

interface PaymentDoc extends mongoose.Document {
  orderId: string;
  chargeId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

// Define the schema
const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    chargeId: {
      type: String,
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

// Define the schema static methods
paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

// Define the model
const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  'Payment',
  paymentSchema
);

export { Payment };
