import {
  User,
  UserSchema,
} from '../../../../../src/users/infrastructure/entities/UserEntity';

describe('User Entity', () => {
  it('should be defined', () => {
    expect(User).toBeDefined();
  });

  it('should have correct schema configuration', () => {
    expect(UserSchema).toBeDefined();
    expect(UserSchema.options.collection).toBe('users');
    expect(UserSchema.options.timestamps).toBe(true);
  });

  it('should have timestamps enabled', () => {
    expect(UserSchema.options.timestamps).toBe(true);
  });

  it('should have correct collection name', () => {
    expect(UserSchema.options.collection).toBe('users');
  });
});
