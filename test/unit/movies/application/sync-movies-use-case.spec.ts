import { Test, TestingModule } from '@nestjs/testing';
import { SyncMoviesUseCase } from '../../../../src/movies/application/SyncMoviesUseCase';
import { MoviesRepository } from '../../../../src/movies/domain/repositories/MoviesRepository';
import { MovieService } from '../../../../src/movies/domain/services/MovieService';
import { Movie } from '../../../../src/movies/domain/models/Movie';

describe('SyncMoviesUseCase', () => {
  let useCase: SyncMoviesUseCase;
  let moviesRepository: jest.Mocked<MoviesRepository>;
  let movieService: jest.Mocked<MovieService>;

  const mockMovies: Movie[] = [
    {
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
    },
    {
      id: null,
      title: 'The Empire Strikes Back',
      episode_id: 5,
      director: 'Irvin Kershner',
      producer: 'Gary Kurtz, Rick McCallum',
      release_date: '1980-05-17',
      opening_crawl: 'It is a dark time for the Rebellion...',
      characters: ['https://swapi.dev/api/people/1/'],
      planets: ['https://swapi.dev/api/planets/4/'],
      starships: ['https://swapi.dev/api/starships/3/'],
      vehicles: ['https://swapi.dev/api/vehicles/8/'],
      species: ['https://swapi.dev/api/species/1/'],
      created: new Date(),
      edited: new Date(),
      url: 'https://swapi.dev/api/films/2/',
    },
  ];

  const mockCreatedMovies: Movie[] = [
    { ...mockMovies[0], id: 'created-movie-1' },
    { ...mockMovies[1], id: 'created-movie-2' },
  ];

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

    const mockMovieService = {
      getFilms: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SyncMoviesUseCase,
        {
          provide: MoviesRepository,
          useValue: mockMoviesRepository,
        },
        {
          provide: MovieService,
          useValue: mockMovieService,
        },
      ],
    }).compile();

    useCase = module.get<SyncMoviesUseCase>(SyncMoviesUseCase);
    moviesRepository = module.get(MoviesRepository);
    movieService = module.get(MovieService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should sync movies successfully', async () => {
      movieService.getFilms.mockResolvedValue(mockMovies);
      moviesRepository.deleteAllMovies.mockResolvedValue(undefined);
      moviesRepository.createMovies.mockResolvedValue(mockCreatedMovies);

      const result = await useCase.execute();

      expect(movieService.getFilms).toHaveBeenCalled();
      expect(moviesRepository.deleteAllMovies).toHaveBeenCalled();
      expect(moviesRepository.createMovies).toHaveBeenCalledWith(mockMovies);
      expect(result).toEqual(mockCreatedMovies);
    });

    it('should handle empty movies list', async () => {
      movieService.getFilms.mockResolvedValue([]);
      moviesRepository.deleteAllMovies.mockResolvedValue(undefined);
      moviesRepository.createMovies.mockResolvedValue([]);

      const result = await useCase.execute();

      expect(movieService.getFilms).toHaveBeenCalled();
      expect(moviesRepository.deleteAllMovies).toHaveBeenCalled();
      expect(moviesRepository.createMovies).toHaveBeenCalledWith([]);
      expect(result).toEqual([]);
    });

    it('should handle service error', async () => {
      const error = new Error('External API error');
      movieService.getFilms.mockRejectedValue(error);

      await expect(useCase.execute()).rejects.toThrow('External API error');
      expect(movieService.getFilms).toHaveBeenCalled();
      expect(moviesRepository.deleteAllMovies).not.toHaveBeenCalled();
      expect(moviesRepository.createMovies).not.toHaveBeenCalled();
    });

    it('should handle delete all movies error', async () => {
      const error = new Error('Database error');
      movieService.getFilms.mockResolvedValue(mockMovies);
      moviesRepository.deleteAllMovies.mockRejectedValue(error);

      await expect(useCase.execute()).rejects.toThrow('Database error');
      expect(movieService.getFilms).toHaveBeenCalled();
      expect(moviesRepository.deleteAllMovies).toHaveBeenCalled();
      expect(moviesRepository.createMovies).not.toHaveBeenCalled();
    });

    it('should handle create movies error', async () => {
      const error = new Error('Create movies error');
      movieService.getFilms.mockResolvedValue(mockMovies);
      moviesRepository.deleteAllMovies.mockResolvedValue(undefined);
      moviesRepository.createMovies.mockRejectedValue(error);

      await expect(useCase.execute()).rejects.toThrow('Create movies error');
      expect(movieService.getFilms).toHaveBeenCalled();
      expect(moviesRepository.deleteAllMovies).toHaveBeenCalled();
      expect(moviesRepository.createMovies).toHaveBeenCalledWith(mockMovies);
    });
  });
});
