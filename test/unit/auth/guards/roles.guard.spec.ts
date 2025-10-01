import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RolesGuard } from '../../../../src/auth/guards/roles.guard';
import { Role } from '../../../../src/users/domain/models/Role';
import { User } from '../../../../src/users/domain/models/User';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;

  const mockUser: Omit<User, 'password'> = {
    id: 'user-id',
    email: 'test@example.com',
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAdminUser: Omit<User, 'password'> = {
    id: 'admin-id',
    email: 'admin@example.com',
    role: Role.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockReflector = {
      getAllAndOverride: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    const createMockContext = (
      user?: Omit<User, 'password'>,
    ): ExecutionContext => {
      return {
        switchToHttp: () => ({
          getRequest: () => ({ user }),
        }),
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as ExecutionContext;
    };

    it('should return true when no roles are required', () => {
      reflector.getAllAndOverride.mockReturnValue(undefined);
      const context = createMockContext(mockUser);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return true when user has required role', () => {
      reflector.getAllAndOverride.mockReturnValue([Role.USER]);
      const context = createMockContext(mockUser);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return true when admin user has required role', () => {
      reflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);
      const context = createMockContext(mockAdminUser);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return true when user has one of multiple required roles', () => {
      reflector.getAllAndOverride.mockReturnValue([Role.ADMIN, Role.USER]);
      const context = createMockContext(mockUser);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException when user is not authenticated', () => {
      reflector.getAllAndOverride.mockReturnValue([Role.USER]);
      const context = createMockContext(undefined);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when user does not have required role', () => {
      reflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);
      const context = createMockContext(mockUser);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });
  });
});
