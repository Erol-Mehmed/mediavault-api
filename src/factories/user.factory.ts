import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker';

export interface UserFactoryOutput {
  id: string;
  username: string;
  email: string;
  password: string;
  created_at: string;
}

export const userFactory = (): UserFactoryOutput => ({
  id: (uuid as () => string)(),
  username: (faker.internet.username as () => string)(),
  email: (faker.internet.email as () => string)(),
  password: (faker.internet.password as (opts?: { length?: number }) => string)(
    { length: 10 },
  ),
  created_at: new Date().toISOString(),
});
