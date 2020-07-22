import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { Ticket } from '../model/ticket';

import {
  validateRequest,
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
} from '@agreejwc/common';

import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be great than zero'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const { title, price } = req.body;
    let ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    if (ticket.orderId) {
      throw new BadRequestError('Ticket is reserved and can not be edited');
    }

    if (ticket.userId !== req.currentuser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({ title, price });
    await ticket.save();

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(200).send(ticket);
  }
);

export { router as updateTicketRouter };
