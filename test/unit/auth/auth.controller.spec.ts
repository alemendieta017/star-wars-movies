import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../../src/auth/infrastructure/api/AuthController';
import { AuthService } from '../../../src/auth/auth.service';
import { AuthResponseDto } from '../../../src/auth/infrastructure/dto/AuthResponseDto';
import { User } from '../../../src/users/domain/models/User';
import { Role } from '../../../src/users/domain/models/Role';

describe('AuthController', () => {
  let controller: AuthController;
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
      generateJwtToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return AuthResponseDto with token and user data', () => {
      const mockToken = 'jwt-token';
      authService.generateJwtToken.mockReturnValue(mockToken);

      const mockRequest = { user: mockUser };
      const result = controller.login(mockRequest);

      expect(authService.generateJwtToken).toHaveBeenCalledWith(mockUser);
      expect(result).toBeInstanceOf(AuthResponseDto);
      expect(result.access_token).toBe(mockToken);
      expect(result.user).toEqual({
        id: 'user-id',
        email: 'test@example.com',
        role: Role.USER,
      });
    });
  });
});
