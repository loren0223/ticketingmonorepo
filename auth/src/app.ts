import express from 'express';
import 'express-async-errors'; // Fix Express async bug
import { json } from 'body-parser';
import cookieSession from 'cookie-session'; // Transfer JWT via cookie

import { currentuserRouter } from './routes/current-user';
import { signupRouter } from './routes/signup';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';

import { errorHandler, NotFoundError } from '@agreejwc/common';

const app = express();
app.set('trust proxy', true); // https://expressjs.com/zh-tw/guide/behind-proxies.html
app.use(json());
//console.log('NODE_ENV=' + process.env.NODE_ENV);
app.use(
  cookieSession({
    name: 'myJWT',
    signed: false,
    secure: process.env.NODE_ENV !== 'test', // "true" means that only transfer cookie-session when using HTTPS
  })
); // https://www.npmjs.com/package/cookie-session

app.use(currentuserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res) => {
  // Fix Express async bug
  throw new NotFoundError('Route not found');
});

app.use(errorHandler);

export { app };
