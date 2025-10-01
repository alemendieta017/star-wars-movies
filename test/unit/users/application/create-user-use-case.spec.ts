import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { CreateUserUseCase } from '../../../../src/users/application/CreateUserUseCase';
import { UsersRepository } from '../../../../src/users/domain/repositories/UsersRepository';
import { RegisterDto } from '../../../../src/users/infrastructure/dto/RegisterDto';
import { User } from '../../../../src/users/domain/models/User';
import { Role } from '../../../../src/users/domain/models/Role';
import * as bcrypt from 'bcryptjs';

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let usersRepository: jest.Mocked<UsersRepository>;

  const mockRegisterDto: RegisterDto = {
    email: 'test@example.com',
    password: 'password123',
    role: Role.USER,
  };

  const mockUser: User = {
    id: 'user-id',
    email: 'test@example.com',
    password: 'hashed-password',
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockUsersRepository = {
      findByEmail: jest.fn(),
      createUser: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    usersRepository = jest.mocked(module.get(UsersRepository));
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create user successfully when email does not exist', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.createUser.mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      const result = await useCase.execute(mockRegisterDto);

      expect(usersRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(usersRepository.createUser).toHaveBeenCalledWith({
        id: null,
        email: 'test@example.com',
        password: 'hashed-password',
        role: Role.USER,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException when email already exists', async () => {
      usersRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(useCase.execute(mockRegisterDto)).rejects.toThrow(
        ConflictException,
      );
      expect(usersRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(usersRepository.createUser).not.toHaveBeenCalled();
    });

    it('should create admin user successfully', async () => {
      const adminRegisterDto: RegisterDto = {
        email: 'admin@example.com',
        password: 'admin123',
        role: Role.ADMIN,
      };

      const adminUser: User = {
        id: 'admin-id',
        email: 'admin@example.com',
        password: 'hashed-admin-password',
        role: Role.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.createUser.mockResolvedValue(adminUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-admin-password');

      const result = await useCase.execute(adminRegisterDto);

      expect(usersRepository.findByEmail).toHaveBeenCalledWith(
        'admin@example.com',
      );
      expect(bcrypt.hash).toHaveBeenCalledWith('admin123', 10);
      expect(usersRepository.createUser).toHaveBeenCalledWith({
        id: null,
        email: 'admin@example.com',
        password: 'hashed-admin-password',
        role: Role.ADMIN,
        createdAt: expect.any(Date) as Date,
        updatedAt: expect.any(Date) as Date,
      });
      expect(result).toEqual(adminUser);
    });

    it('should handle repository errors', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      const error = new Error('Database error');
      usersRepository.createUser.mockRejectedValue(error);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      await expect(useCase.execute(mockRegisterDto)).rejects.toThrow(
        'Database error',
      );
      expect(usersRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(usersRepository.createUser).toHaveBeenCalled();
    });
  });
});
