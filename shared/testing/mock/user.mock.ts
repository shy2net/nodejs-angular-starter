import * as faker from 'faker';

import { UserProfile } from '../../models/user-profile';

/**
 * Generates a root user we can connect with to the web interface.
 */
export function generateMockRootUser(): UserProfile {
  return {
    ...generateMockUser(),
    email: 'root@mail.com',
    password: 'root',
    roles: ['admin'],
  };
}

/**
 * Generates a mock user for the tests.
 * @param roles
 */
export function generateMockUser(roles: string[] = []): UserProfile {
  return {
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: faker.internet.password(),
    roles: roles,
  };
}
