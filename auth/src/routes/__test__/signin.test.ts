it('fails when a mail that does not exist is supplied', async () => {
  await global.signin('test@test.com', '12345678', 400);
});

it('fails when an incorrect password is supplied', async () => {
  await global.signup('test@test.com', '12345678', 201);

  await global.signin('test@test.com', 'abcd', 400);
});

it('response with a cookie when successfully signin', async () => {
  await global.signup('test@test.com', '12345678', 201);

  const cookie = await global.signin('test@test.com', '12345678', 200);

  expect(cookie).toBeDefined();
});
