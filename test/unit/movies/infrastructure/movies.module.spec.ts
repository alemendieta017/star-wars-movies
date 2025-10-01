import { MoviesModule } from '../../../../src/movies/infrastructure/movies.module';

describe('MoviesModule', () => {
  it('should be defined', () => {
    expect(MoviesModule).toBeDefined();
  });

  it('should be a class', () => {
    expect(typeof MoviesModule).toBe('function');
  });
});
