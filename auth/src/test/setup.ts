import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';

declare global {
  namespace NodeJS {
    interface Global {
      signup(
        email: string,
        password: string,
        statusCode: number
      ): Promise<string[]>;

      signin(
        email: string,
        password: string,
        statusCode: number
      ): Promise<string[]>;
    }
  }
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_SECRET_KEY = 'test';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

//// Helper ////
global.signup = async (email, password, statusCode) => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: email, password: password })
    .expect(statusCode);
  const cookie = response.get('Set-Cookie');
  return cookie;
};

global.signin = async (email, password, statusCode) => {
  const response = await request(app)
    .post('/api/users/signin')
    .send({ email: email, password: password })
    .expect(statusCode);
  const cookie = response.get('Set-Cookie');
  return cookie;
};
