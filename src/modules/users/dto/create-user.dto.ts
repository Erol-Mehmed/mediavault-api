import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 64)
  password: string;

  @IsString()
  @Length(3, 30)
  username: string;
}
