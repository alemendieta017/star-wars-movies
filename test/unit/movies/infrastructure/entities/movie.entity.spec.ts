import {
  Movie,
  MovieSchema,
} from '../../../../../src/movies/infrastructure/entities/MovieEntity';

describe('Movie Entity', () => {
  it('should be defined', () => {
    expect(Movie).toBeDefined();
  });

  it('should have correct schema configuration', () => {
    expect(MovieSchema).toBeDefined();
    expect(MovieSchema.options.collection).toBe('movies');
    expect(MovieSchema.options.timestamps).toBe(true);
  });

  it('should have timestamps enabled', () => {
    expect(MovieSchema.options.timestamps).toBe(true);
  });

  it('should have correct collection name', () => {
    expect(MovieSchema.options.collection).toBe('movies');
  });
});
