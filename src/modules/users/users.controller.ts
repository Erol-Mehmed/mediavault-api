import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() data: CreateUserDto) {
    return this.usersService.register(data);
  }

  @Get()
  getALL() {
    return this.usersService.getAll();
  }
}
