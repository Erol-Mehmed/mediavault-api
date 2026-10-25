import { ConflictException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserAlreadyExistsError } from '../../common/errors/user-already-exists.error';
import { RegisterResponse } from './types/register-response';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async register(data: CreateUserDto): Promise<RegisterResponse> {
    try {
      return await this.usersRepository.register(data);
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
