import { app } from './app';
import mongoose from 'mongoose';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompletedListener } from './events/listeners/expiration-completed-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';

const startApp = async () => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error('JWT_SECRET_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }

  if (!process.env.EXPIRATION_TIME_SECONDS) {
    throw new Error('EXPIRATION_TIME_SECONDS must be defined');
  }

  console.log(`JWT_SECRET_KEY = ${process.env.JWT_SECRET_KEY}`);
  console.log(`MONGO_URI = ${process.env.MONGO_URI}`);
  console.log(`NATS_CLUSTER_ID = ${process.env.NATS_CLUSTER_ID}`);
  console.log(`NATS_CLIENT_ID = ${process.env.NATS_CLIENT_ID}`);
  console.log(`NATS_URL = ${process.env.NATS_URL}`);
  console.log(
    `EXPIRATION_TIME_SECONDS = ${process.env.EXPIRATION_TIME_SECONDS}`
  );

  try {
    // Connect to NATS Streaming Server
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    // Event Listeners
    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompletedListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();

    // Connect to MongoDb
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log('Connected to MongoDb');

    app.listen(3000, () => {
      console.log('@@@ Listening on port 3000 @@@');
    });
  } catch (err) {
    console.error(err);
  }
};

startApp();
