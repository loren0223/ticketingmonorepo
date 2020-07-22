import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest } from '@agreejwc/common';

import { User } from '../models/user';

import { BadRequestError } from '@agreejwc/common';
import { Password } from '../services/password';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').trim().notEmpty().withMessage('You must enter a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError('User not found');
    }

    // Verify the password
    const storedPassword = user.password;
    if (!(await Password.compare(storedPassword, password))) {
      throw new BadRequestError('Password is not correct');
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET_KEY!
    );

    // Store it on session object
    // ERROR:
    //     Syntax Issue: Type '{ jwt: string; }' is missing the following properties from type 'CookieSessionObject': isChanged, isNew, isPopulatedts(2739)
    //     Ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/27288
    // CORRECTION:
    //     Use @types/cookie-session version 2.0.39, instead of ^2.0.40
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(user);
  }
);

export { router as signinRouter };
