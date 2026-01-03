import { IsNumber, IsString } from 'class-validator';

export class TokenResponseDto {
  @IsString()
  access_token: string;

  @IsString()
  refresh_token: string;

  @IsNumber()
  expires_in: number;

  @IsString()
  token_type: string;
}
