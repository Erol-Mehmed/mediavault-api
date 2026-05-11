import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() data: CreateUserDto) {
    return this.usersService.register(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getALL() {
    return this.usersService.getAll();
  }
}
