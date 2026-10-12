export class UserAlreadyExistsError extends Error {
  constructor() {
    super('User already exist');
    this.name = 'UserAlreadyExistsError';
  }
}
