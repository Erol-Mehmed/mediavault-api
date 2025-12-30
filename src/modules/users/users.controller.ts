import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import User from './users.model';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() data: Partial<User>) {
    return this.usersService.create(data);
  }

  @Get()
  getALL() {
    return this.usersService.getAll();
  }
}
