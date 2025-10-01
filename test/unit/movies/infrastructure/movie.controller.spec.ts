import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from '../../../../src/movies/infrastructure/api/MovieController';
import { ListMoviesUseCase } from '../../../../src/movies/application/ListMoviesUseCase';
import { CreateMovieUseCase } from '../../../../src/movies/application/CreateMovieUseCase';
import { GetMovieByIdUseCase } from '../../../../src/movies/application/GetMovieByIdUseCase';
import { UpdateMovieUseCase } from '../../../../src/movies/application/UpdateMovieUseCase';
import { DeleteMovieUseCase } from '../../../../src/movies/application/DeleteMovieUseCase';
import { SyncMoviesUseCase } from '../../../../src/movies/application/SyncMoviesUseCase';
import { CreateMovieDto } from '../../../../src/movies/infrastructure/dto/CreateMovieDto';
import { UpdateMovieDto } from '../../../../src/movies/infrastructure/dto/UpdateMovieDto';
import { ListMoviesDto } from '../../../../src/movies/infrastructure/dto/ListMoviesDto';
import { ListMoviesResponseDto } from '../../../../src/movies/infrastructure/dto/ListMoviesResponseDto';
import { SyncMoviesResponseDto } from '../../../../src/movies/infrastructure/dto/SyncMoviesResponseDto';
import { Movie } from '../../../../src/movies/domain/models/Movie';
import { PaginatedResult } from '../../../../src/movies/domain/repositories/MoviesRepository';

describe('MovieController', () => {
  let controller: MovieController;
  let listMoviesUseCase: jest.Mocked<ListMoviesUseCase>;
  let createMovieUseCase: jest.Mocked<CreateMovieUseCase>;
  let getMovieByIdUseCase: jest.Mocked<GetMovieByIdUseCase>;
  let updateMovieUseCase: jest.Mocked<UpdateMovieUseCase>;
  let deleteMovieUseCase: jest.Mocked<DeleteMovieUseCase>;
  let syncMoviesUseCase: jest.Mocked<SyncMoviesUseCase>;

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
    const mockListMoviesUseCase = {
      execute: jest.fn(),
    };

    const mockCreateMovieUseCase = {
      execute: jest.fn(),
    };

    const mockGetMovieByIdUseCase = {
      execute: jest.fn(),
    };

    const mockUpdateMovieUseCase = {
      execute: jest.fn(),
    };

    const mockDeleteMovieUseCase = {
      execute: jest.fn(),
    };

    const mockSyncMoviesUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: ListMoviesUseCase,
          useValue: mockListMoviesUseCase,
        },
        {
          provide: CreateMovieUseCase,
          useValue: mockCreateMovieUseCase,
        },
        {
          provide: GetMovieByIdUseCase,
          useValue: mockGetMovieByIdUseCase,
        },
        {
          provide: UpdateMovieUseCase,
          useValue: mockUpdateMovieUseCase,
        },
        {
          provide: DeleteMovieUseCase,
          useValue: mockDeleteMovieUseCase,
        },
        {
          provide: SyncMoviesUseCase,
          useValue: mockSyncMoviesUseCase,
        },
      ],
    }).compile();

    controller = module.get<MovieController>(MovieController);
    listMoviesUseCase = module.get(ListMoviesUseCase);
    createMovieUseCase = module.get(CreateMovieUseCase);
    getMovieByIdUseCase = module.get(GetMovieByIdUseCase);
    updateMovieUseCase = module.get(UpdateMovieUseCase);
    deleteMovieUseCase = module.get(DeleteMovieUseCase);
    syncMoviesUseCase = module.get(SyncMoviesUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMovies', () => {
    it('should return paginated movies', async () => {
      const listMoviesDto: ListMoviesDto = { page: 1, rows: 10 };
      const mockResult: PaginatedResult<Movie> = {
        data: [mockMovie],
        totalCount: 1,
      };
      listMoviesUseCase.execute.mockResolvedValue(mockResult);

      const result = await controller.getMovies(listMoviesDto);

      expect(listMoviesUseCase.execute).toHaveBeenCalledWith({
        page: 1,
        rows: 10,
      });
      expect(result).toBeInstanceOf(ListMoviesResponseDto);
      expect(result.movies).toEqual([mockMovie]);
      expect(result.totalCount).toBe(1);
    });

    it('should use default pagination values when not provided', async () => {
      const listMoviesDto: ListMoviesDto = {};
      const mockResult: PaginatedResult<Movie> = {
        data: [mockMovie],
        totalCount: 1,
      };
      listMoviesUseCase.execute.mockResolvedValue(mockResult);

      const result = await controller.getMovies(listMoviesDto);

      expect(listMoviesUseCase.execute).toHaveBeenCalledWith({
        page: 1,
        rows: 10,
      });
      expect(result).toBeInstanceOf(ListMoviesResponseDto);
    });
  });

  describe('createMovie', () => {
    it('should create a movie', async () => {
      const createMovieDto: CreateMovieDto = {
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
        url: 'https://swapi.dev/api/films/1/',
        created: '2014-12-10T14:23:31.880000Z',
        edited: '2014-12-20T19:49:45.256000Z',
      };
      createMovieUseCase.execute.mockResolvedValue(mockMovie);

      const result = await controller.createMovie(createMovieDto);

      expect(createMovieUseCase.execute).toHaveBeenCalled();
      expect(result).toEqual(mockMovie);
    });
  });

  describe('getMovieById', () => {
    it('should return movie by id', async () => {
      const movieId = 'movie-id';
      getMovieByIdUseCase.execute.mockResolvedValue(mockMovie);

      const result = await controller.getMovieById(movieId);

      expect(getMovieByIdUseCase.execute).toHaveBeenCalledWith(movieId);
      expect(result).toEqual(mockMovie);
    });
  });

  describe('updateMovie', () => {
    it('should update a movie', async () => {
      const movieId = 'movie-id';
      const updateMovieDto: UpdateMovieDto = {
        title: 'Star Wars: A New Hope',
        director: 'George Lucas (Updated)',
      };
      const updatedMovie = {
        ...mockMovie,
        ...updateMovieDto,
        created: new Date(),
        edited: new Date(),
      };
      updateMovieUseCase.execute.mockResolvedValue(updatedMovie);

      const result = await controller.updateMovie(movieId, updateMovieDto);

      expect(updateMovieUseCase.execute).toHaveBeenCalledWith(
        movieId,
        expect.any(Object),
      );
      expect(result).toEqual(updatedMovie);
    });
  });

  describe('deleteMovie', () => {
    it('should delete a movie', async () => {
      const movieId = 'movie-id';
      deleteMovieUseCase.execute.mockResolvedValue(undefined);

      await controller.deleteMovie(movieId);

      expect(deleteMovieUseCase.execute).toHaveBeenCalledWith(movieId);
    });
  });

  describe('syncMovies', () => {
    it('should sync movies', async () => {
      const mockMovies = [mockMovie];
      syncMoviesUseCase.execute.mockResolvedValue(mockMovies);

      const result = await controller.syncMovies();

      expect(syncMoviesUseCase.execute).toHaveBeenCalled();
      expect(result).toBeInstanceOf(SyncMoviesResponseDto);
      expect(result.syncedMovies).toEqual(['A New Hope']);
      expect(result.totalCount).toBe(1);
    });
  });
});
