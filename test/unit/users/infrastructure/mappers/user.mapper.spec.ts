import { UserMapper } from '../../../../../src/users/infrastructure/mappers/UserMapper';
import { User as UserEntity } from '../../../../../src/users/infrastructure/entities/UserEntity';
import { User } from '../../../../../src/users/domain/models/User';
import { Role } from '../../../../../src/users/domain/models/Role';
import { Types } from 'mongoose';

describe('UserMapper', () => {
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

  describe('toDomain', () => {
    it('should map entity to domain model', () => {
      const result = UserMapper.toDomain(mockUserEntity);

      expect(result).toEqual(mockUserDomain);
    });

    it('should handle null _id', () => {
      const entityWithoutId = { ...mockUserEntity, _id: null };
      const result = UserMapper.toDomain(entityWithoutId);

      expect(result.id).toBeNull();
    });

    it('should handle admin role', () => {
      const adminEntity = { ...mockUserEntity, role: Role.ADMIN };
      const result = UserMapper.toDomain(adminEntity);

      expect(result.role).toBe(Role.ADMIN);
    });
  });

  describe('toDomainList', () => {
    it('should map array of entities to domain models', () => {
      const entities = [mockUserEntity];
      const result = UserMapper.toDomainList(entities);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockUserDomain);
    });

    it('should handle empty array', () => {
      const result = UserMapper.toDomainList([]);

      expect(result).toEqual([]);
    });

    it('should handle multiple entities', () => {
      const secondEntity = {
        ...mockUserEntity,
        _id: new Types.ObjectId(),
        email: 'test2@example.com',
      };
      const entities = [mockUserEntity, secondEntity];
      const result = UserMapper.toDomainList(entities);

      expect(result).toHaveLength(2);
      expect(result[0].email).toBe('test@example.com');
      expect(result[1].email).toBe('test2@example.com');
    });
  });

  describe('toPersistance', () => {
    it('should map domain model to persistence format', () => {
      const result = UserMapper.toPersistance(mockUserDomain);

      expect(result).toEqual({
        email: 'test@example.com',
        password: 'hashed-password',
        role: Role.USER,
      });
    });

    it('should handle admin role', () => {
      const adminUser = { ...mockUserDomain, role: Role.ADMIN };
      const result = UserMapper.toPersistance(adminUser);

      expect(result.role).toBe(Role.ADMIN);
    });
  });
});
