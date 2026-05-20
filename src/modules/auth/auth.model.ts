export interface AuthSession {
  user_id: string;

  access_token: string;
  refresh_token: string;

  access_token_expires_in: number;
  refresh_token_expires_at: string;

  token_type: 'Bearer';
}
