import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  register(data: CreateUserDto) {
    return this.usersRepository.register(data);
  }

  getAll() {
    return this.usersRepository.getAll();
  }

  findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }
}
