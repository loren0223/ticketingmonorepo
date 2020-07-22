import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { body } from 'express-validator';
import { stripe } from '../stripe';
import {
  requireAuth,
  BadRequestError,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@agreejwc/common';
import { PaymentCreatedPublisher } from '../events/publisher/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [
    body('token').notEmpty().withMessage('Token must be provided'),
    body('orderId').notEmpty().withMessage('OrderId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    // Error validation
    if (!order) {
      throw new NotFoundError('Order not found');
    }
    if (order.userId !== req.currentuser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for a cancelled order');
    }

    // Stripe Payments Service
    const charge = await stripe.charges.create({
      amount: order.price * 100,
      currency: 'USD',
      source: token,
    });

    // Tying order and payment together
    const payment = Payment.build({
      orderId: order.id,
      chargeId: charge.id,
    });
    await payment.save();

    // Publish Payment:Created event
    new PaymentCreatedPublisher(natsWrapper.client).publish({
      orderId: payment.orderId,
    });

    // Return response
    res.status(201).send({ paymentId: payment.id });
  }
);

export { router as createChargeRouter };
