import { AppModule } from '../../src/app.module';

describe('Main Bootstrap', () => {
  it('should have AppModule defined', () => {
    expect(AppModule).toBeDefined();
  });

  it('should be a class', () => {
    expect(typeof AppModule).toBe('function');
  });
});
