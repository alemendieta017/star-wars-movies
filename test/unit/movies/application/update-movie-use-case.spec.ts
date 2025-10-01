import { Test, TestingModule } from '@nestjs/testing';
import { UpdateMovieUseCase } from '../../../../src/movies/application/UpdateMovieUseCase';
import { MoviesRepository } from '../../../../src/movies/domain/repositories/MoviesRepository';
import { Movie } from '../../../../src/movies/domain/models/Movie';

describe('UpdateMovieUseCase', () => {
  let useCase: UpdateMovieUseCase;
  let moviesRepository: jest.Mocked<MoviesRepository>;

  const mockExistingMovie: Movie = {
    id: 'movie-id',
    title: 'A New Hope',
    episode_id: 4,
    director: 'George Lucas',
    producer: 'Gary Kurtz, Rick McCallum',
    release_date: '1977-05-25',
    opening_crawl: 'It is a period of civil war...',
    characters: ['https://swapi.dev/api/people/1/'],
    planets: ['https://swapi.dev/api/planets/1/'],
    starships: ['https://swapi.dev/api/starships/2/'],
    vehicles: ['https://swapi.dev/api/vehicles/4/'],
    species: ['https://swapi.dev/api/species/1/'],
    created: new Date(),
    edited: new Date(),
    url: 'https://swapi.dev/api/films/1/',
  };

  const mockUpdatedMovie: Movie = {
    ...mockExistingMovie,
    title: 'Star Wars: A New Hope',
    director: 'George Lucas (Updated)',
  };

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
        UpdateMovieUseCase,
        {
          provide: MoviesRepository,
          useValue: mockMoviesRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateMovieUseCase>(UpdateMovieUseCase);
    moviesRepository = module.get(MoviesRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should update movie and return updated movie', async () => {
      const movieId = 'movie-id';
      const updateData: Partial<Movie> = {
        title: 'Star Wars: A New Hope',
        director: 'George Lucas (Updated)',
      };

      moviesRepository.getMovieById.mockResolvedValue(mockExistingMovie);
      moviesRepository.updateMovie.mockResolvedValue(mockUpdatedMovie);

      const result = await useCase.execute(movieId, updateData);

      expect(moviesRepository.getMovieById).toHaveBeenCalledWith(movieId);
      expect(moviesRepository.updateMovie).toHaveBeenCalledWith({
        ...mockExistingMovie,
        ...updateData,
        id: movieId,
      });
      expect(result).toEqual(mockUpdatedMovie);
    });

    it('should handle movie not found error', async () => {
      const movieId = 'non-existent-id';
      const updateData: Partial<Movie> = { title: 'New Title' };
      const error = new Error('Movie not found');

      moviesRepository.getMovieById.mockRejectedValue(error);

      await expect(useCase.execute(movieId, updateData)).rejects.toThrow(
        'Movie not found',
      );
      expect(moviesRepository.getMovieById).toHaveBeenCalledWith(movieId);
      expect(moviesRepository.updateMovie).not.toHaveBeenCalled();
    });

    it('should handle update error', async () => {
      const movieId = 'movie-id';
      const updateData: Partial<Movie> = { title: 'New Title' };
      const error = new Error('Update failed');

      moviesRepository.getMovieById.mockResolvedValue(mockExistingMovie);
      moviesRepository.updateMovie.mockRejectedValue(error);

      await expect(useCase.execute(movieId, updateData)).rejects.toThrow(
        'Update failed',
      );
      expect(moviesRepository.getMovieById).toHaveBeenCalledWith(movieId);
      expect(moviesRepository.updateMovie).toHaveBeenCalledWith({
        ...mockExistingMovie,
        ...updateData,
        id: movieId,
      });
    });
  });
});
