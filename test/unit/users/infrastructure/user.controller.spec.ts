import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../../../src/users/infrastructure/api/UserController';
import { CreateUserUseCase } from '../../../../src/users/application/CreateUserUseCase';
import { AuthService } from '../../../../src/auth/auth.service';
import { RegisterDto } from '../../../../src/users/infrastructure/dto/RegisterDto';
import { AuthResponseDto } from '../../../../src/auth/infrastructure/dto/AuthResponseDto';
import { User } from '../../../../src/users/domain/models/User';
import { Role } from '../../../../src/users/domain/models/Role';

describe('UserController', () => {
  let controller: UserController;
  let createUserUseCase: jest.Mocked<CreateUserUseCase>;
  let authService: jest.Mocked<AuthService>;

  const mockUser: User = {
    id: 'user-id',
    email: 'test@example.com',
    password: 'hashed-password',
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRegisterDto: RegisterDto = {
    email: 'test@example.com',
    password: 'password123',
    role: Role.USER,
  };

  beforeEach(async () => {
    const mockCreateUserUseCase = {
      execute: jest.fn(),
    };

    const mockAuthService = {
      generateJwtToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: CreateUserUseCase,
          useValue: mockCreateUserUseCase,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    createUserUseCase = module.get(CreateUserUseCase);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register user and return AuthResponseDto', async () => {
      const mockToken = 'jwt-token';
      createUserUseCase.execute.mockResolvedValue(mockUser);
      authService.generateJwtToken.mockReturnValue(mockToken);

      const result = await controller.register(mockRegisterDto);

      expect(createUserUseCase.execute).toHaveBeenCalledWith(mockRegisterDto);
      expect(authService.generateJwtToken).toHaveBeenCalledWith(mockUser);
      expect(result).toBeInstanceOf(AuthResponseDto);
      expect(result.access_token).toBe(mockToken);
      expect(result.user).toEqual({
        id: 'user-id',
        email: 'test@example.com',
        role: Role.USER,
      });
    });

    it('should register admin user and return AuthResponseDto', async () => {
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

      const mockToken = 'admin-jwt-token';
      createUserUseCase.execute.mockResolvedValue(adminUser);
      authService.generateJwtToken.mockReturnValue(mockToken);

      const result = await controller.register(adminRegisterDto);

      expect(createUserUseCase.execute).toHaveBeenCalledWith(adminRegisterDto);
      expect(authService.generateJwtToken).toHaveBeenCalledWith(adminUser);
      expect(result).toBeInstanceOf(AuthResponseDto);
      expect(result.access_token).toBe(mockToken);
      expect(result.user).toEqual({
        id: 'admin-id',
        email: 'admin@example.com',
        role: Role.ADMIN,
      });
    });

    it('should handle create user use case errors', async () => {
      const error = new Error('User already exists');
      createUserUseCase.execute.mockRejectedValue(error);

      await expect(controller.register(mockRegisterDto)).rejects.toThrow(
        'User already exists',
      );
      expect(createUserUseCase.execute).toHaveBeenCalledWith(mockRegisterDto);
      expect(authService.generateJwtToken).not.toHaveBeenCalled();
    });

    it('should handle auth service errors', async () => {
      const error = new Error('JWT generation failed');
      createUserUseCase.execute.mockResolvedValue(mockUser);
      authService.generateJwtToken.mockImplementation(() => {
        throw error;
      });

      await expect(controller.register(mockRegisterDto)).rejects.toThrow(
        'JWT generation failed',
      );
      expect(createUserUseCase.execute).toHaveBeenCalledWith(mockRegisterDto);
      expect(authService.generateJwtToken).toHaveBeenCalledWith(mockUser);
    });
  });
});
