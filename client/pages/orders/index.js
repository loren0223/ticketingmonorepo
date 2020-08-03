import Link from 'next/link';

const OrderIndex = ({ orders }) => {
  const orderList = orders.map((order) => {
    const localDateString = new Date(order.createdAt).toLocaleString();
    const isCompleted = order.status === 'completed' ? true : false;

    return (
      <tr key={order.id}>
        <td>{localDateString}</td>
        <td>{order.ticket.category}</td>
        <td>{order.ticket.title}</td>
        <td>{order.ticket.price}</td>
        <td>{order.status}</td>
        <td>
          {!isCompleted && (
            <Link href="/orders/[orderId]" as={`/orders/${order.id}`}>
              <a>Pay</a>
            </Link>
          )}
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>My Orders</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Order Time</th>
            <th>Category</th>
            <th>Title</th>
            <th>Price</th>
            <th>Status</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{orderList}</tbody>
      </table>
    </div>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders');

  return { orders: data };
};

export default OrderIndex;
