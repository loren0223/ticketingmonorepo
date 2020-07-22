import request from 'supertest';
import { app } from '../../app';

it('response with the details about the current user', async () => {
  const cookie = await global.signup('test@test.com', '12345678', 201); // Get cookie-session

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentuser.email).toEqual('test@test.com');
});

it('response with null currentuser when not authorized', async () => {
  const cookie: string[] = [];

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentuser).toEqual(null);
});
