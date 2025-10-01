import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { LocalStrategy } from '../../../../src/auth/strategies/local.strategy';
import { AuthService } from '../../../../src/auth/auth.service';
import { User } from '../../../../src/users/domain/models/User';
import { Role } from '../../../../src/users/domain/models/Role';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: jest.Mocked<AuthService>;

  const mockUser: Omit<User, 'password'> = {
    id: 'user-id',
    email: 'test@example.com',
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockAuthService = {
      validateUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user when credentials are valid', async () => {
      authService.validateUser.mockResolvedValue(mockUser);

      const result = await strategy.validate('test@example.com', 'password');

      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password',
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      authService.validateUser.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      await expect(
        strategy.validate('test@example.com', 'wrong-password'),
      ).rejects.toThrow(UnauthorizedException);

      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'wrong-password',
      );
    });

    it('should throw UnauthorizedException when authService throws any error', async () => {
      authService.validateUser.mockRejectedValue(new Error('Database error'));

      await expect(
        strategy.validate('test@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);

      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password',
      );
    });
  });
});
