import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

describe('PostsService', () => {
  let service: PostsService;
  let repo: Repository<Post>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    provider: 'google',
    providerId: '123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPost = {
    id: '1',
    title: 'Test Post',
    content: 'Test Content',
    author: mockUser,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    repo = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      mockRepository.find.mockResolvedValue([mockPost]);

      const result = await service.findAll();

      expect(result).toEqual([mockPost]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a post if found', async () => {
      mockRepository.findOne.mockResolvedValue(mockPost);

      const result = await service.findOne('1');

      expect(result).toEqual(mockPost);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if post not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const createPostDto = {
        title: 'Test Post',
        content: 'Test Content',
      };

      mockRepository.create.mockReturnValue(mockPost);
      mockRepository.save.mockResolvedValue(mockPost);

      const result = await service.create(createPostDto, mockUser);

      expect(result).toEqual(mockPost);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createPostDto,
        author: mockUser,
      });
    });
  });

  describe('update', () => {
    it('should update post if user is author', async () => {
      const updatePostDto = {
        title: 'Updated Title',
      };

      mockRepository.findOne.mockResolvedValue(mockPost);
      mockRepository.save.mockResolvedValue({ ...mockPost, ...updatePostDto });

      const result = await service.update('1', updatePostDto, mockUser);

      expect(result.title).toBe(updatePostDto.title);
    });

    it('should throw ForbiddenException if user is not author', async () => {
      const differentUser: User = {
        ...mockUser,
        id: '2',
      };
      mockRepository.findOne.mockResolvedValue(mockPost);

      await expect(
        service.update('1', { title: 'Updated' }, differentUser),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove post if user is author', async () => {
      mockRepository.findOne.mockResolvedValue(mockPost);
      mockRepository.remove.mockResolvedValue(mockPost);

      await service.remove('1', mockUser);

      expect(mockRepository.remove).toHaveBeenCalledWith(mockPost);
    });

    it('should throw ForbiddenException if user is not author', async () => {
      const differentUser: User = {
        ...mockUser,
        id: '2',
      };
      mockRepository.findOne.mockResolvedValue(mockPost);

      await expect(service.remove('1', differentUser)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
}); 