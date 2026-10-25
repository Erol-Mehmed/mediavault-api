import User from '../users.model';

export type RegisterResponse = Pick<
  User,
  | 'id'
  | 'email'
  | 'username'
  | 'is_active'
  | 'is_premium'
  | 'created_at'
  | 'updated_at'
>;
