import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import User from './users.model';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  create(data: Partial<User>) {
    return this.usersRepository.create(data);
  }

  getAll() {
    return this.usersRepository.getAll();
  }
}
