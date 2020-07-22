import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { Order } from '../models/order';
import { Ticket } from '../models/ticket';

import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';

import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  OrderStatus,
} from '@agreejwc/common';

const router = express.Router();

router.post(
  '/api/orders',
  requireAuth,
  [body('ticketId').notEmpty().withMessage('Ticket Id must be provided')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    // Make sure that the ticket is not already reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    // Calculate the expiration date for the order
    const expirationDate = new Date();
    expirationDate.setSeconds(
      expirationDate.getSeconds() +
        Number.parseInt(process.env.EXPIRATION_TIME_SECONDS!)
    );

    // Build the order and save to database
    const order = Order.build({
      userId: req.currentuser!.id,
      status: OrderStatus.Created,
      expiresAt: expirationDate,
      ticket,
    });
    await order.save();

    // Publish the event saying that the order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
