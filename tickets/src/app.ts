import express from 'express';
import 'express-async-errors'; // Fix Express async bug
import { json } from 'body-parser';
import cookieSession from 'cookie-session'; // Transfer JWT via cookie

import { createTicketRouter } from './routes/create';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes/index';
import { updateTicketRouter } from './routes/update';

import { errorHandler, NotFoundError, currentUser } from '@agreejwc/common';

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

app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all('*', async (req, res) => {
  // Fix Express async bug
  throw new NotFoundError('Route not found');
});

app.use(errorHandler);

export { app };
