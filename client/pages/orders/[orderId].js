import { useState, useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const ShowOrder = ({ currentuser, order }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    // Invoke when quit the page
    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return (
      <div>
        <h1>Order Expired</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Purchasing {order.ticket.title}</h1>
      <h4>Time left to pay: {timeLeft} seconds</h4>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51H5kHsGUhwhD57bTLsprbWWFURZyOTcstoPRfCLqYumvav4CUQZqrHGrHCxa0URrM4RGyxEdaeNdNlwAxxkqiJb000d2Brnqoj"
        amount={order.ticket.price * 100}
        email={currentuser.email}
      />
      {errors}
    </div>
  );
};

ShowOrder.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  console.log('orderId=', orderId);
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default ShowOrder;
