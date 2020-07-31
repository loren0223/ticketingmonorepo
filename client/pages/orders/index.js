import Link from 'next/link';

const OrderIndex = ({ orders }) => {
  const orderList = orders.map((order) => {
    return (
      <tr key={order.id}>
        <td>{order.ticket.category}</td>
        <td>{order.ticket.title}</td>
        <td>{order.ticket.price}</td>
        <td>{order.status}</td>
        <td>
          <Link href="/orders/[orderId]" as={`/orders/${order.id}`}>
            <a>View</a>
          </Link>
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
