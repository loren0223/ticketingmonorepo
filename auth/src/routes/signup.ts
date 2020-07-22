import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest, BadRequestError } from '@agreejwc/common';

import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email is invalid'),
    body('password')
      .trim()
      .isLength({ min: 8, max: 16 })
      .withMessage('Password must be between 8 and 16 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET_KEY!
    );

    // Store it on session object
    // Syntax Issue: Type '{ jwt: string; }' is missing the following properties from type 'CookieSessionObject': isChanged, isNew, isPopulatedts(2739)
    // Solution: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/27288
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
