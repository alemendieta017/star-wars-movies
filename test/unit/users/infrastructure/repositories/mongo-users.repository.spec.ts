import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MongoUsersRepository } from '../../../../../src/users/infrastructure/repositories/MongoUsersRepository';
import { User as UserEntity } from '../../../../../src/users/infrastructure/entities/UserEntity';
import { User } from '../../../../../src/users/domain/models/User';
import { Role } from '../../../../../src/users/domain/models/Role';
import { Model } from 'mongoose';
import { Types } from 'mongoose';

describe('MongoUsersRepository', () => {
  let repository: MongoUsersRepository;
  let userModel: jest.Mocked<Model<UserEntity>>;

  const mockUserEntity: UserEntity = {
    _id: new Types.ObjectId(),
    email: 'test@example.com',
    password: 'hashed-password',
    role: Role.USER,
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-02T00:00:00.000Z'),
  } as UserEntity;

  const mockUserDomain: User = {
    id: mockUserEntity._id.toString(),
    email: 'test@example.com',
    password: 'hashed-password',
    role: Role.USER,
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-02T00:00:00.000Z'),
  };

  beforeEach(async () => {
    const mockModel = {
      findOne: jest.fn().mockReturnThis(),
      create: jest.fn(),
      findById: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongoUsersRepository,
        {
          provide: getModelToken(UserEntity.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    repository = module.get<MongoUsersRepository>(MongoUsersRepository);
    userModel = module.get(getModelToken(UserEntity.name));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      const mockQuery = {
        findOne: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUserEntity),
      };

      userModel.findOne.mockReturnValue(mockQuery as any);

      const result = await repository.findByEmail('test@example.com');

      expect(userModel.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(result).toEqual(mockUserDomain);
    });

    it('should return null when user not found', async () => {
      const mockQuery = {
        findOne: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      };

      userModel.findOne.mockReturnValue(mockQuery as any);

      const result = await repository.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      userModel.create.mockResolvedValue(mockUserEntity as any);

      const result = await repository.createUser(mockUserDomain);

      expect(userModel.create).toHaveBeenCalled();
      expect(result).toEqual(mockUserDomain);
    });

    it('should create admin user', async () => {
      const adminUser = { ...mockUserDomain, role: Role.ADMIN };
      const adminEntity = { ...mockUserEntity, role: Role.ADMIN };
      userModel.create.mockResolvedValue(adminEntity as any);

      const result = await repository.createUser(adminUser);

      expect(result.role).toBe(Role.ADMIN);
    });
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const mockQuery = {
        findById: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUserEntity),
      };

      userModel.findById.mockReturnValue(mockQuery as any);

      const result = await repository.findById('user-id');

      expect(userModel.findById).toHaveBeenCalledWith('user-id');
      expect(result).toEqual(mockUserDomain);
    });

    it('should return null when user not found', async () => {
      const mockQuery = {
        findById: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      };

      userModel.findById.mockReturnValue(mockQuery as any);

      const result = await repository.findById('non-existent-id');

      expect(result).toBeNull();
    });
  });
});
