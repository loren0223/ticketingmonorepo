import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'movie',
    price: 10,
    userId: '12312sdf',
  });
  await ticket.save();

  // Fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // Make two separate changes on these tickets
  firstInstance?.set({ price: 15 });
  secondInstance?.set({ price: 20 });

  // Save the first ticket instance
  await firstInstance?.save();

  // Save the second ticket instance and expect an error
  try {
    await secondInstance?.save();
  } catch (err) {
    return;
  }
  throw new Error('Should not run this line');
});

it('increments the version number on multiple saves', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'movie',
    price: 10,
    userId: '12312sdf',
  });
  await ticket.save();

  // Expect version = 0
  expect(ticket.version).toEqual(0);

  // Make the first change on the ticket and save
  ticket.set({ price: 20 });
  await ticket.save();

  // Expect version = 1
  expect(ticket.version).toEqual(1);

  // Make the second change on the ticket and save
  ticket.set({ price: 30 });
  await ticket.save();

  // Expect version = 2
  expect(ticket.version).toEqual(2);
});
