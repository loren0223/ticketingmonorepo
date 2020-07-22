import express, { Request, Response } from 'express';
import { currentUser } from '@agreejwc/common';

const router = express.Router();

router.get(
  '/api/users/currentuser',
  currentUser,
  (req: Request, res: Response) => {
    res.send({ currentuser: req.currentuser || null });
  }
);

export { router as currentuserRouter };
