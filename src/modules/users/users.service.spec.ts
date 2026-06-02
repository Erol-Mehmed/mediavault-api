import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsersRepository = {
    register: jest.fn(),
    getAll: jest.fn(),
    findByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ---------------- REGISTER ----------------
  describe('register', () => {
    it('should register user', async () => {
      const user = {
        id: 'user-1',
        email: 'test@example.com',
      };

      mockUsersRepository.register.mockResolvedValue(user);

      const result = await service.register({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(mockUsersRepository.register).toHaveBeenCalled();

      expect(result).toEqual(user);
    });
  });

  // ---------------- GET ALL ----------------
  describe('getAll', () => {
    it('should return all users', async () => {
      const users = [
        {
          id: 'user-1',
          email: 'user1@example.com',
        },
        {
          id: 'user-2',
          email: 'user2@example.com',
        },
      ];

      mockUsersRepository.getAll.mockResolvedValue(users);

      const result = await service.getAll();

      expect(mockUsersRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  // ---------------- FIND BY EMAIL ----------------
  describe('findByEmail', () => {
    it('should return user by email', async () => {
      const user = {
        id: 'user-1',
        email: 'test@example.com',
      };

      mockUsersRepository.findByEmail.mockResolvedValue(user);

      const result = await service.findByEmail('test@example.com');

      expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(result).toEqual(user);
    });

    it('should return null if user does not exist', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(null);

      const result = await service.findByEmail('missing@example.com');

      expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(
        'missing@example.com',
      );
      expect(result).toBeNull();
    });
  });
});
