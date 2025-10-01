import { ListMoviesDto } from '../../../../../src/movies/infrastructure/dto/ListMoviesDto';

describe('ListMoviesDto', () => {
  it('should create DTO with default values', () => {
    const dto = new ListMoviesDto();

    expect(dto.page).toBe(1);
    expect(dto.rows).toBe(10);
  });

  it('should create DTO with provided values', () => {
    const dto = new ListMoviesDto();
    dto.page = 2;
    dto.rows = 20;

    expect(dto.page).toBe(2);
    expect(dto.rows).toBe(20);
  });

  it('should handle undefined values', () => {
    const dto = new ListMoviesDto();
    dto.page = undefined;
    dto.rows = undefined;

    expect(dto.page).toBeUndefined();
    expect(dto.rows).toBeUndefined();
  });

  it('should handle null values', () => {
    const dto = new ListMoviesDto();
    dto.page = null;
    dto.rows = null;

    expect(dto.page).toBeNull();
    expect(dto.rows).toBeNull();
  });
});
