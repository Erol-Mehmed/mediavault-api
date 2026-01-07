import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(read)

  @Post('register')
  create(@Body() data: CreateUserDto) {
    return this.usersService.create(data);
  }
}
