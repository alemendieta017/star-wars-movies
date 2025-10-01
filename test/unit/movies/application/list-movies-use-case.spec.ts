import { Test, TestingModule } from '@nestjs/testing';
import { ListMoviesUseCase } from '../../../../src/movies/application/ListMoviesUseCase';
import {
  MoviesRepository,
  ListMoviesQuery,
  PaginatedResult,
} from '../../../../src/movies/domain/repositories/MoviesRepository';
import { Movie } from '../../../../src/movies/domain/models/Movie';

describe('ListMoviesUseCase', () => {
  let useCase: ListMoviesUseCase;
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

  const mockPaginatedResult: PaginatedResult<Movie> = {
    data: [mockMovie],
    totalCount: 1,
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
        ListMoviesUseCase,
        {
          provide: MoviesRepository,
          useValue: mockMoviesRepository,
        },
      ],
    }).compile();

    useCase = module.get<ListMoviesUseCase>(ListMoviesUseCase);
    moviesRepository = module.get(MoviesRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return paginated movies when query is provided', async () => {
      const query: ListMoviesQuery = { page: 1, rows: 10 };
      moviesRepository.getMovies.mockResolvedValue(mockPaginatedResult);

      const result = await useCase.execute(query);

      expect(moviesRepository.getMovies).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should return paginated movies when no query is provided', async () => {
      moviesRepository.getMovies.mockResolvedValue(mockPaginatedResult);

      const result = await useCase.execute();

      expect(moviesRepository.getMovies).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should handle empty results', async () => {
      const emptyResult: PaginatedResult<Movie> = {
        data: [],
        totalCount: 0,
      };
      moviesRepository.getMovies.mockResolvedValue(emptyResult);

      const result = await useCase.execute();

      expect(moviesRepository.getMovies).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(emptyResult);
    });
  });
});
