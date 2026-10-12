import { ConflictException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserAlreadyExistsError } from '../../common/errors/user-already-exists.error';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  register(data: CreateUserDto) {
    try {
      return this.usersRepository.register(data);
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException('Email or username already exists');
      }

      throw error;
    }
  }

  getAll() {
    return this.usersRepository.getAll();
  }

  findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }
}
