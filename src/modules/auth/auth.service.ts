import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  register(data: CreateUserDto) {
    return this.usersRepository.create(data);
  }

  login(data: LoginDto) {
    const user = this.usersService.findByEmail(data.email);

    console.log('test>>', user);
  }
}
