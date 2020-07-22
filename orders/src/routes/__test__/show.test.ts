import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    version: 0,
  });
  await ticket.save();
  return ticket;
};

const buildOrder = async () => {
  const userOne = global.signin();
  const userTwo = global.signin();

  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();

  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  return { userOne, userTwo, orderOne, orderTwo };
};

it('return 404 if the order is not found', async () => {
  const id = mongoose.Types.ObjectId();
  await request(app)
    .get(`/api/orders/${id}`)
    .set('Cookie', global.signin())
    .send({})
    .expect(404);
});

it('return 401 if the order was not created by the user', async () => {
  const { userOne, orderTwo } = await buildOrder();

  await request(app)
    .get(`/api/orders/${orderTwo.id}`)
    .set('Cookie', userOne)
    .send({})
    .expect(401);
});

it('return the order that created by particular user by id', async () => {
  const { userOne, orderOne } = await buildOrder();

  const response = await request(app)
    .get(`/api/orders/${orderOne.id}`)
    .set('Cookie', userOne)
    .send({})
    .expect(200);

  expect(response.body.id).toEqual(orderOne.id);
});
