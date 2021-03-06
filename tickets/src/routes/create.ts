import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { Ticket } from '../model/ticket';

import { validateRequest, requireAuth } from '@agreejwc/common';

import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('category').notEmpty().withMessage('Category is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be great than zero'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { category, title, price } = req.body;
    const currentUser = req.currentuser!;
    const userId = currentUser.id;

    // const existingTicket = await Ticket.findOne({ title });
    // if (existingTicket) {
    //   throw new BadRequestError('Ticket exists');
    // }

    const ticket = Ticket.build({ category, title, price, userId });
    await ticket.save();

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      category: ticket.category,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
