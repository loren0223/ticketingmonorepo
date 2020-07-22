import request from 'supertest';
import { app } from '../../app';

const createTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'Sport', price: 100 })
    .expect(201);
};

it('has a route handler listening to /api/tickets for get requests', async () => {
  const response = await request(app).get('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('fetch all the tickets from the server', async () => {
  await createTicket(); //1
  await createTicket(); //2
  await createTicket(); //3

  const response = await request(app).get('/api/tickets').send({}).expect(200);

  expect(response.body.length).toEqual(3);
});
