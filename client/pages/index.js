import Link from 'next/link';

const LandingPage = ({ currentuser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.category}</td>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>{ticket.createdAt}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets for Sale</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Title</th>
            <th>Price</th>
            <th>Sale Time</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

// context === { req, res }
// LandingPage.getInitialProps = async (context) => {
LandingPage.getInitialProps = async (context, client, currentuser) => {
  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default LandingPage;
