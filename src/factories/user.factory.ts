import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

export interface UserFactoryOutput {
  id: string;
  username: string;
  email: string;
  password: string; // hashed
  created_at: string;
}

// --- Uniqueness storage ---
const usedEmails = new Set<string>();
const usedUsernames = new Set<string>();

// --- Helpers ---
const generateUniqueEmail = (): string => {
  while (true) {
    const email = faker.internet.email();
    if (!usedEmails.has(email)) {
      usedEmails.add(email);
      return email;
    }
  }
};

const generateUniqueUsername = (): string => {
  while (true) {
    const username = faker.internet.username();
    if (!usedUsernames.has(username)) {
      usedUsernames.add(username);
      return username;
    }
  }
};

// --- Precompute hashed password ---
const DEFAULT_PASSWORD = '123456';
const HASHED_PASSWORD = bcrypt.hashSync(DEFAULT_PASSWORD, 10);

export const userFactory = (): UserFactoryOutput => ({
  id: uuid(),
  username: generateUniqueUsername(),
  email: generateUniqueEmail(),
  password: HASHED_PASSWORD,
  created_at: new Date().toISOString(),
});
