import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  create(data: CreateUserDto) {
    return this.usersRepository.create(data);
  }

  getAll() {
    return this.usersRepository.getAll();
  }
}
