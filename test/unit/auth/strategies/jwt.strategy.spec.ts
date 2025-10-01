import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../../../../src/auth/strategies/jwt.strategy';
import { AuthService } from '../../../../src/auth/auth.service';
import { User } from '../../../../src/users/domain/models/User';
import { Role } from '../../../../src/users/domain/models/Role';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
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
      validateJwtPayload: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user when payload is valid', async () => {
      const payload = { sub: 'user-id' };
      authService.validateJwtPayload.mockResolvedValue(mockUser);

      const result = await strategy.validate(payload);

      expect(authService.validateJwtPayload).toHaveBeenCalledWith(payload);
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found', async () => {
      const payload = { sub: 'non-existent-id' };
      authService.validateJwtPayload.mockResolvedValue(null);

      const result = await strategy.validate(payload);

      expect(authService.validateJwtPayload).toHaveBeenCalledWith(payload);
      expect(result).toBeNull();
    });
  });
});
