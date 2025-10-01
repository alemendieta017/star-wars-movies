import { AuthModule } from '../../../src/auth/auth.module';

describe('AuthModule', () => {
  it('should be defined', () => {
    expect(AuthModule).toBeDefined();
  });

  it('should be a class', () => {
    expect(typeof AuthModule).toBe('function');
  });
});
