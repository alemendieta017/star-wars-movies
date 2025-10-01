import { Test, TestingModule } from '@nestjs/testing';
import { DeleteMovieUseCase } from '../../../../src/movies/application/DeleteMovieUseCase';
import { MoviesRepository } from '../../../../src/movies/domain/repositories/MoviesRepository';

describe('DeleteMovieUseCase', () => {
  let useCase: DeleteMovieUseCase;
  let moviesRepository: jest.Mocked<MoviesRepository>;

  beforeEach(async () => {
    const mockMoviesRepository = {
      getMovies: jest.fn(),
      getMovieById: jest.fn(),
      createMovie: jest.fn(),
      updateMovie: jest.fn(),
      deleteMovie: jest.fn(),
      deleteAllMovies: jest.fn(),
      createMovies: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteMovieUseCase,
        {
          provide: MoviesRepository,
          useValue: mockMoviesRepository,
        },
      ],
    }).compile();

    useCase = module.get<DeleteMovieUseCase>(DeleteMovieUseCase);
    moviesRepository = module.get(MoviesRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should delete movie successfully', async () => {
      const movieId = 'movie-id';
      moviesRepository.deleteMovie.mockResolvedValue(undefined);

      await useCase.execute(movieId);

      expect(moviesRepository.deleteMovie).toHaveBeenCalledWith(movieId);
    });

    it('should handle repository errors', async () => {
      const movieId = 'non-existent-id';
      const error = new Error('Movie not found');
      moviesRepository.deleteMovie.mockRejectedValue(error);

      await expect(useCase.execute(movieId)).rejects.toThrow('Movie not found');
      expect(moviesRepository.deleteMovie).toHaveBeenCalledWith(movieId);
    });
  });
});
