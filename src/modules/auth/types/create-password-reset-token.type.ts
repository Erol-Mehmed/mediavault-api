export interface CreatePasswordResetToken {
  user_id: string;
  token_hash: string;
  expires_at: string;
}
