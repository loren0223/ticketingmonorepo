import express, { Request, Response } from 'express';
import { Order, OrderStatus } from '../models/order';

import { natsWrapper } from '../nats-wrapper';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';

import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from '@agreejwc/common';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    if (order.userId !== req.currentuser!.id) {
      throw new NotAuthorizedError();
    }

    // Change status to Cancelled
    order.status = OrderStatus.Cancelled;
    await order.save();

    // Publish an event saying that order was cancelled
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
