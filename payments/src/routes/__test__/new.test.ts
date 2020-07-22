import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import mongoose from 'mongoose';
import { OrderStatus } from '@agreejwc/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

jest.mock('../../stripe.ts');

const newId = () => {
  return new mongoose.Types.ObjectId().toHexString();
};

it('throw an error if order not found', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'falkj3klefkl3',
      orderId: '234fdskfajl3',
    })
    .expect(404);
});

it('throw an error if user is not authenticated', async () => {
  const order = Order.build({
    id: newId(),
    version: 0,
    status: OrderStatus.Created,
    userId: newId(),
    price: 10,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'falkj3klefkl3',
      orderId: order.id,
    })
    .expect(401);
});

it('throw an error if order is already cancelled', async () => {
  const userId = newId();
  const cookie = global.signin(userId);

  const order = Order.build({
    id: newId(),
    version: 0,
    status: OrderStatus.Cancelled,
    userId,
    price: 10,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: 'falkj3klefkl3',
      orderId: order.id,
    })
    .expect(400);
});

it('return 201 after making a successful charge', async () => {
  const userId = newId();
  const cookie = global.signin(userId);

  const order = Order.build({
    id: newId(),
    version: 0,
    status: OrderStatus.Created,
    userId,
    price: 10,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  console.log((stripe.charges.create as jest.Mock).mock.calls);

  const options = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(options.currency).toEqual('USD');
  expect(options.source).toEqual('tok_visa');
  expect(options.amount).toEqual(10 * 100);

  const payment = await Payment.findOne({});
  expect(payment?.chargeId).toEqual('12345');
});
