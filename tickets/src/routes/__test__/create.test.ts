import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../model/ticket';
import { natsWrapper } from '../../nats-wrapper';

const apiPath = '/api/tickets';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post(apiPath).send({});

  expect(response.status).not.toEqual(404);
});

it('return a 401 if the user is not signed in', async () => {
  await request(app).post(apiPath).send({}).expect(401);
});

it('return a status other than 401 if user is signed in', async () => {
  const response = await request(app)
    .post(apiPath)
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('return a 400 if an invalid title is provided', async () => {
  const cookie = global.signin();

  const data = [{ price: 10 }, { title: '', price: 10 }];

  data.forEach(async (body) => {
    await request(app)
      .post(apiPath)
      .set('Cookie', cookie)
      .send(body)
      .expect(400);
  });
});

it('return a 400 if an invalid price is provided', async () => {
  const cookie = global.signin();

  const data = [
    { title: 'title' },
    { title: 'title', price: -1 },
    { title: 'title', price: 0 },
  ];

  data.forEach(async (body) => {
    await request(app)
      .post(apiPath)
      .set('Cookie', cookie)
      .send(body)
      .expect(400);
  });
});

it('create a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const data = {
    title: 'Good fruit',
    price: 10,
  };

  await request(app)
    .post(apiPath)
    .set('Cookie', global.signin())
    .send(data)
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(data.title);
  expect(tickets[0].price).toEqual(data.price);
  // expect(tickets[0].userId).toEqual('1234567890');
});

it('publishes an event', async () => {
  const data = {
    title: 'Good fruit',
    price: 10,
  };

  await request(app)
    .post(apiPath)
    .set('Cookie', global.signin())
    .send(data)
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
