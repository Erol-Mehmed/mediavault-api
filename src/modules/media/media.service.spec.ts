import { Test, TestingModule } from '@nestjs/testing';
import { MediaService } from './media.service';
import { MediaRepository } from './media.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
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

    it('should throw if media not found', async () => {
      mockMediaRepository.update.mockResolvedValue(null);

      await expect(
        service.update('user-1', '1', { title: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ---------------- REMOVE ----------------
  describe('remove', () => {
    it('should delete media', async () => {
      mockMediaRepository.remove.mockResolvedValue(true);

      const result = await service.remove('user-1', '1');

      expect(result).toBe(true);
    });

    it('should throw if media not deleted', async () => {
      mockMediaRepository.remove.mockResolvedValue(null);

      await expect(service.remove('user-1', '1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ---------------- GET ALL ----------------
  describe('getAll', () => {
    it('should return all media', async () => {
      mockMediaRepository.getAll.mockResolvedValue([{ id: '1' }, { id: '2' }]);

      const result = await service.getAll('user-1');

      expect(result.length).toBe(2);
    });
  });

  // ---------------- GET ONE ----------------
  describe('getOne', () => {
    it('should return media', async () => {
      mockMediaRepository.getOne.mockResolvedValue({ id: '1' });

      const result = await service.getOne('user-1', '1');

      expect(result.id).toBe('1');
    });

    it('should throw if not found', async () => {
      mockMediaRepository.getOne.mockResolvedValue(null);

      await expect(service.getOne('user-1', '1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
