import { Test, TestingModule } from '@nestjs/testing';
import { CreateMovieUseCase } from '../../../../src/movies/application/CreateMovieUseCase';
import { MoviesRepository } from '../../../../src/movies/domain/repositories/MoviesRepository';
import { Movie } from '../../../../src/movies/domain/models/Movie';

describe('CreateMovieUseCase', () => {
  let useCase: CreateMovieUseCase;
  let moviesRepository: jest.Mocked<MoviesRepository>;

  const mockMovie: Movie = {
    id: null,
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

  const mockCreatedMovie: Movie = {
    ...mockMovie,
    id: 'created-movie-id',
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
        CreateMovieUseCase,
        {
          provide: MoviesRepository,
          useValue: mockMoviesRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateMovieUseCase>(CreateMovieUseCase);
    moviesRepository = module.get(MoviesRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a movie and return it with id', async () => {
      moviesRepository.createMovie.mockResolvedValue(mockCreatedMovie);

      const result = await useCase.execute(mockMovie);

      expect(moviesRepository.createMovie).toHaveBeenCalledWith(mockMovie);
      expect(result).toEqual(mockCreatedMovie);
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      moviesRepository.createMovie.mockRejectedValue(error);

      await expect(useCase.execute(mockMovie)).rejects.toThrow(
        'Database error',
      );
      expect(moviesRepository.createMovie).toHaveBeenCalledWith(mockMovie);
    });
  });
});
