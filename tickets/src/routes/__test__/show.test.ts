import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../model/ticket';
import mongoose from 'mongoose';

const apiPath = '/api/tickets';

it('return a 404 if the ticket is not found', async () => {
  // Fake Object Id
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get(`${apiPath}/${id}`)
    .set('Cookie', global.signin())
    .send({})
    .expect(404);
});

it('return the ticket if it is found', async () => {
  const title = 'Sport game';
  const price = 100;

  const response = await request(app)
    .post(apiPath)
    .set('Cookie', global.signin())
    .send({ title, price })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`${apiPath}/${response.body.id}`)
    .set('Cookie', global.signin())
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
