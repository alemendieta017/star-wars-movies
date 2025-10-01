import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../../src/auth/auth.service';
import { UsersRepository } from '../../../src/users/domain/repositories/UsersRepository';
import { User } from '../../../src/users/domain/models/User';
import { Role } from '../../../src/users/domain/models/Role';
import * as bcrypt from 'bcryptjs';

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: jest.Mocked<UsersRepository>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser: User = {
    id: 'user-id',
    email: 'test@example.com',
    password: 'hashed-password',
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserWithoutPassword = {
    id: 'user-id',
    email: 'test@example.com',
    role: Role.USER,
    createdAt: mockUser.createdAt,
    updatedAt: mockUser.updatedAt,
  };

  beforeEach(async () => {
    const mockUsersRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get(UsersRepository);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      usersRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password');

      expect(usersRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password',
        'hashed-password',
      );
      expect(result).toEqual(mockUserWithoutPassword);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);

      await expect(
        service.validateUser('test@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);

      expect(usersRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      usersRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUser('test@example.com', 'wrong-password'),
      ).rejects.toThrow(UnauthorizedException);

      expect(usersRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrong-password',
        'hashed-password',
      );
    });
  });

  describe('generateJwtToken', () => {
    it('should generate JWT token with correct payload', () => {
      const expectedToken = 'jwt-token';
      jwtService.sign.mockReturnValue(expectedToken);

      const result = service.generateJwtToken(mockUserWithoutPassword);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: 'test@example.com',
        sub: 'user-id',
        role: Role.USER,
      });
      expect(result).toBe(expectedToken);
    });
  });

  describe('validateJwtPayload', () => {
    it('should return user without password when user exists', async () => {
      usersRepository.findById.mockResolvedValue(mockUser);

      const result = await service.validateJwtPayload({ sub: 'user-id' });

      expect(usersRepository.findById).toHaveBeenCalledWith('user-id');
      expect(result).toEqual(mockUserWithoutPassword);
    });

    it('should return null when user does not exist', async () => {
      usersRepository.findById.mockResolvedValue(null);

      const result = await service.validateJwtPayload({
        sub: 'non-existent-id',
      });

      expect(usersRepository.findById).toHaveBeenCalledWith('non-existent-id');
      expect(result).toBeNull();
    });
  });
});
