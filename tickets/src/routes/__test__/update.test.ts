import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../model/ticket';
import mongoose from 'mongoose';

it('has a route handler listening to /api/tickets for put requests', async () => {
  const ticketResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      category: 'movie',
      title: 'sport',
      price: 100,
    })
    .expect(201);

  const response = await request(app)
    .put(`/api/tickets/${ticketResponse.body.id}`)
    .send({
      category: 'movie',
      title: 'sport',
      price: 100,
    });

  expect(response.status).not.toEqual(404);
});

it('return a 401 if the user is not signed in', async () => {
  const ticketResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      category: 'movie',
      title: 'sport',
      price: 100,
    })
    .expect(201);

  const response = await request(app)
    .put(`/api/tickets/${ticketResponse.body.id}`)
    .send({
      category: 'movie',
      title: 'concern',
      price: 200,
    })
    .expect(401);
});

it('return a 401 if the ticket is not belonged to the user', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      category: 'movie',
      title: 'sport',
      price: 100,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      category: 'movie',
      title: 'concern',
      price: 200,
    })
    .expect(401);
});

it('return a 400 if an invalid title or price is provided', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      category: 'movie',
      title: 'sport',
      price: 100,
    })
    .expect(201);

  const data = [
    { category: 'movie', price: 10 },
    { category: 'movie', title: '', price: 10 },
    { category: 'movie', title: 'concern' },
    { category: 'movie', title: 'concern', price: 0 },
    { category: 'movie', title: 'concern', price: -1 },
  ];

  data.forEach(async (body) => {
    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send(body)
      .expect(400);
  });
});

it('return 404 if the ticket is not found', async () => {
  const cookie = global.signin();
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({
      category: 'movie',
      title: 'concern',
      price: 200,
    })
    .expect(404);
});

it('update a ticket with valid inputs', async () => {
  const cookie = global.signin();
  const category = 'movie';
  const title = 'concern';
  const price = 200;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      category: 'match',
      title: 'sport',
      price: 100,
    })
    .expect(201);

  const updateResponse = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      category,
      title,
      price,
    })
    .expect(200);

  expect(updateResponse.body.category).toEqual(category);
  expect(updateResponse.body.title).toEqual(title);
  expect(updateResponse.body.price).toEqual(price);
});

it('reject the editing if the ticket is reserved', async () => {
  const cookie = global.signin();
  const category = 'concert';
  const title = 'Rock & Roll';
  const price = 200;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      category: 'match',
      title: 'sport',
      price: 100,
    })
    .expect(201);

  const ticket = await Ticket.findById(response.body.id);
  ticket?.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  ticket?.save();

  const updateResponse = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      category,
      title,
      price,
    })
    .expect(400);
});
