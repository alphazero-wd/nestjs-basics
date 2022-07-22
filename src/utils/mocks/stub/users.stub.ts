import { User } from '../../../users/entities/user.entity';

export const mockedUser: User = {
  id: 1,
  email: 'user@email.com',
  name: 'John',
  password: 'hash',
  address: {
    id: 1,
    street: 'streetName',
    city: 'cityName',
    country: 'countryName',
  },
  stripeCustomerId: 'customer_id',
  isEmailConfirmed: false,
  posts: [],
  isTwoFactorAuthEnabled: false,
};
