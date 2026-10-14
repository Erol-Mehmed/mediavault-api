import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 64)
  password: string;

  @IsString()
  @Length(3, 30)
  username: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  first_name?: string | null;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  last_name?: string | null;
}
