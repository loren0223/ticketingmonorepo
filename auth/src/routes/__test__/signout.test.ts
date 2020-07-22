import request from 'supertest';
import { app } from '../../app';

it('clear the cookie after successful signout', async () => {
  await global.signup('test@test.com', '12345678', 201);

  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);

  expect(
    response.get('Set-Cookie')[0] ===
      'myJWT=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});
