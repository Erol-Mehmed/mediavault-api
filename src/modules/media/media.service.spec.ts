import { Test, TestingModule } from '@nestjs/testing';
import { MediaService } from './media.service';
import { MediaRepository } from './media.repository';
import { BadRequestException } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';

describe('MediaService', () => {
  let service: MediaService;

  const mockMediaRepository = {
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getAll: jest.fn(),
    getOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        {
          provide: MediaRepository,
          useValue: mockMediaRepository,
        },
      ],
    }).compile();

    service = module.get<MediaService>(MediaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ---------------- CREATE ----------------
  describe('create', () => {
    it('should create media', async () => {
      mockMediaRepository.create.mockResolvedValue({
        id: '1',
        title: 'Test',
      });

      const result = await service.create('user-1', {
        title: 'Test',
      } as CreateMediaDto);

      expect(mockMediaRepository.create).toHaveBeenCalled();
      expect(result).toEqual({
        id: '1',
        title: 'Test',
      });
    });
  });

  // ---------------- UPDATE ----------------
  describe('update', () => {
    it('should update media', async () => {
      mockMediaRepository.update.mockResolvedValue({
        id: '1',
        title: 'Updated',
      });

      const result = await service.update('user-1', '1', {
        title: 'Updated',
      });

      expect(result.title).toBe('Updated');
    });

    it('should throw if no fields provided', async () => {
      await expect(service.update('user-1', '1', {})).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
