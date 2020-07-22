import request from 'supertest';
import { app } from '../../app';

it('return a 201 on successful signup', async () => {
  await global.signup('test@test.com', '12345678', 201);
});

it('return a 400 with invalid email', async () => {
  await global.signup('test', '12345678', 400);
});

it('return a 400 with invalid password', async () => {
  await global.signup('test@test.com', '123', 400);

  await global.signup('test@test.com', '12345678901234567', 400);
});

it('return a 400 without email or password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      password: '1234567890',
    })
    .expect(400);

  await request(app).post('/api/users/signup').send({}).expect(400);
});

it('disallows duplicate email', async () => {
  await global.signup('test@test.com', '12345678', 201);

  await global.signup('test@test.com', '12345678', 400);
});

it('set a cookie after successful signup', async () => {
  const cookie = await global.signup('test@test.com', '12345678', 201);

  expect(cookie).toBeDefined();
});
