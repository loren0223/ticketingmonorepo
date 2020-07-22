export const chargeId = '12345';

export const stripe = {
  charges: {
    create: jest.fn().mockImplementation(() => {
      return { id: chargeId };
    }),
  },
};
