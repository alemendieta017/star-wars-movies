import { User as UserEntity } from '../entities/UserEntity';
import { User } from '../../domain/models/User';

export class UserMapper {
  static toDomain(userEntity: UserEntity): User {
    return {
      id: userEntity._id.toString() || null,
      email: userEntity.email,
      password: userEntity.password,
      role: userEntity.role,
      createdAt: userEntity.createdAt,
      updatedAt: userEntity.updatedAt,
    };
  }

  static toDomainList(userEntities: UserEntity[]): User[] {
    return userEntities.map((entity) => this.toDomain(entity));
  }

  static toPersistance(userDomain: User): Partial<UserEntity> {
    return {
      email: userDomain.email,
      password: userDomain.password,
      role: userDomain.role,
    };
  }
}
