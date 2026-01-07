import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getAll() {
    return this.usersRepository.getAll();
  }

  findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }
}
