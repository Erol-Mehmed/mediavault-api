export interface RefreshToken {
  id?: string;

  user_id: string;
  token_hash: string;

  expires_at: string;
  revoked?: boolean;

  created_at?: string;
  updated_at?: string;
}
