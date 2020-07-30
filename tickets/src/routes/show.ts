import express, { Request, Response } from 'express';

import { Ticket } from '../model/ticket';

import { NotFoundError } from '@agreejwc/common';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError('Ticket not found');
  }

  res.status(200).send(ticket);
});

export { router as showTicketRouter };
