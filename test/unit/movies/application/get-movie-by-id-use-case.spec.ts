import { Test, TestingModule } from '@nestjs/testing';
import { GetMovieByIdUseCase } from '../../../../src/movies/application/GetMovieByIdUseCase';
import { MoviesRepository } from '../../../../src/movies/domain/repositories/MoviesRepository';
import { Movie } from '../../../../src/movies/domain/models/Movie';

describe('GetMovieByIdUseCase', () => {
  let useCase: GetMovieByIdUseCase;
  let moviesRepository: jest.Mocked<MoviesRepository>;

  const mockMovie: Movie = {
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
        GetMovieByIdUseCase,
        {
          provide: MoviesRepository,
          useValue: mockMoviesRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetMovieByIdUseCase>(GetMovieByIdUseCase);
    moviesRepository = module.get(MoviesRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return movie when found', async () => {
      const movieId = 'movie-id';
      moviesRepository.getMovieById.mockResolvedValue(mockMovie);

      const result = await useCase.execute(movieId);

      expect(moviesRepository.getMovieById).toHaveBeenCalledWith(movieId);
      expect(result).toEqual(mockMovie);
    });

    it('should handle repository errors', async () => {
      const movieId = 'non-existent-id';
      const error = new Error('Movie not found');
      moviesRepository.getMovieById.mockRejectedValue(error);

      await expect(useCase.execute(movieId)).rejects.toThrow('Movie not found');
      expect(moviesRepository.getMovieById).toHaveBeenCalledWith(movieId);
    });
  });
});
