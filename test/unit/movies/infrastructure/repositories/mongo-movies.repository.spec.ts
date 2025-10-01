import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { MongoMoviesRepository } from '../../../../../src/movies/infrastructure/repositories/MongoMoviesRepository';
import { Movie as MovieEntity } from '../../../../../src/movies/infrastructure/entities/MovieEntity';
import { Movie } from '../../../../../src/movies/domain/models/Movie';
import { Model } from 'mongoose';
import { Types } from 'mongoose';

describe('MongoMoviesRepository', () => {
  let repository: MongoMoviesRepository;
  let movieModel: jest.Mocked<Model<MovieEntity>>;

  const mockMovieEntity: MovieEntity = {
    _id: new Types.ObjectId(),
    created: '2023-01-01T00:00:00.000Z',
    edited: '2023-01-02T00:00:00.000Z',
    starships: ['https://swapi.dev/api/starships/2/'],
    vehicles: ['https://swapi.dev/api/vehicles/4/'],
    planets: ['https://swapi.dev/api/planets/1/'],
    producer: 'Gary Kurtz, Rick McCallum',
    title: 'A New Hope',
    episode_id: 4,
    director: 'George Lucas',
    release_date: '1977-05-25',
    opening_crawl: 'It is a period of civil war...',
    characters: ['https://swapi.dev/api/people/1/'],
    species: ['https://swapi.dev/api/species/1/'],
    url: 'https://swapi.dev/api/films/1/',
  } as MovieEntity;

  const mockMovieDomain: Movie = {
    id: mockMovieEntity._id.toString(),
    created: new Date('2023-01-01T00:00:00.000Z'),
    edited: new Date('2023-01-02T00:00:00.000Z'),
    starships: ['https://swapi.dev/api/starships/2/'],
    vehicles: ['https://swapi.dev/api/vehicles/4/'],
    planets: ['https://swapi.dev/api/planets/1/'],
    producer: 'Gary Kurtz, Rick McCallum',
    title: 'A New Hope',
    episode_id: 4,
    director: 'George Lucas',
    release_date: '1977-05-25',
    opening_crawl: 'It is a period of civil war...',
    characters: ['https://swapi.dev/api/people/1/'],
    species: ['https://swapi.dev/api/species/1/'],
    url: 'https://swapi.dev/api/films/1/',
  };

  beforeEach(async () => {
    const mockModel = {
      find: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn(),
      countDocuments: jest.fn().mockReturnThis(),
      create: jest.fn(),
      findById: jest.fn().mockReturnThis(),
      findByIdAndUpdate: jest.fn().mockReturnThis(),
      findByIdAndDelete: jest.fn().mockReturnThis(),
      deleteMany: jest.fn().mockReturnThis(),
      insertMany: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongoMoviesRepository,
        {
          provide: getModelToken(MovieEntity.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    repository = module.get<MongoMoviesRepository>(MongoMoviesRepository);
    movieModel = module.get(getModelToken(MovieEntity.name));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getMovies', () => {
    it('should return paginated movies with default values', async () => {
      const mockQuery = {
        find: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockMovieEntity]),
      };
      const mockCountQuery = {
        countDocuments: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(1),
      };

      movieModel.find.mockReturnValue(mockQuery as any);
      movieModel.countDocuments.mockReturnValue(mockCountQuery as any);

      const result = await repository.getMovies();

      expect(movieModel.find).toHaveBeenCalled();
      expect(mockQuery.skip).toHaveBeenCalledWith(0);
      expect(mockQuery.limit).toHaveBeenCalledWith(10);
      expect(result.data).toHaveLength(1);
      expect(result.totalCount).toBe(1);
    });

    it('should return paginated movies with custom query', async () => {
      const query = { page: 2, rows: 5 };
      const mockQuery = {
        find: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockMovieEntity]),
      };
      const mockCountQuery = {
        countDocuments: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(1),
      };

      movieModel.find.mockReturnValue(mockQuery as any);
      movieModel.countDocuments.mockReturnValue(mockCountQuery as any);

      const result = await repository.getMovies(query);

      expect(mockQuery.skip).toHaveBeenCalledWith(5);
      expect(mockQuery.limit).toHaveBeenCalledWith(5);
      expect(result.data).toHaveLength(1);
      expect(result.totalCount).toBe(1);
    });
  });

  describe('createMovie', () => {
    it('should create a movie', async () => {
      movieModel.create.mockResolvedValue(mockMovieEntity as any);

      const result = await repository.createMovie(mockMovieDomain);

      expect(movieModel.create).toHaveBeenCalled();
      expect(result).toEqual(mockMovieDomain);
    });
  });

  describe('getMovieById', () => {
    it('should return movie by id', async () => {
      const mockQuery = {
        findById: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockMovieEntity),
      };

      movieModel.findById.mockReturnValue(mockQuery as any);

      const result = await repository.getMovieById('movie-id');

      expect(movieModel.findById).toHaveBeenCalledWith('movie-id');
      expect(result).toEqual(mockMovieDomain);
    });

    it('should throw NotFoundException when movie not found', async () => {
      const mockQuery = {
        findById: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      };

      movieModel.findById.mockReturnValue(mockQuery as any);

      await expect(repository.getMovieById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateMovie', () => {
    it('should update a movie', async () => {
      const mockQuery = {
        findByIdAndUpdate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockMovieEntity),
      };

      movieModel.findByIdAndUpdate.mockReturnValue(mockQuery as any);

      const result = await repository.updateMovie(mockMovieDomain);

      expect(movieModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockMovieDomain.id,
        expect.any(Object),
        {
          new: true,
        },
      );
      expect(result).toEqual(mockMovieDomain);
    });

    it('should throw NotFoundException when movie not found', async () => {
      const mockQuery = {
        findByIdAndUpdate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      };

      movieModel.findByIdAndUpdate.mockReturnValue(mockQuery as any);

      await expect(repository.updateMovie(mockMovieDomain)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteMovie', () => {
    it('should delete a movie', async () => {
      const mockQuery = {
        findByIdAndDelete: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockMovieEntity),
      };

      movieModel.findByIdAndDelete.mockReturnValue(mockQuery as any);

      await repository.deleteMovie('movie-id');

      expect(movieModel.findByIdAndDelete).toHaveBeenCalledWith('movie-id');
    });

    it('should throw NotFoundException when movie not found', async () => {
      const mockQuery = {
        findByIdAndDelete: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      };

      movieModel.findByIdAndDelete.mockReturnValue(mockQuery as any);

      await expect(repository.deleteMovie('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteAllMovies', () => {
    it('should delete all movies', async () => {
      const mockQuery = {
        deleteMany: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({ deletedCount: 5 }),
      };

      movieModel.deleteMany.mockReturnValue(mockQuery as any);

      await repository.deleteAllMovies();

      expect(movieModel.deleteMany).toHaveBeenCalledWith({});
    });
  });

  describe('createMovies', () => {
    it('should create multiple movies', async () => {
      const movies = [mockMovieDomain];
      movieModel.insertMany.mockResolvedValue([mockMovieEntity] as any);

      const result = await repository.createMovies(movies);

      expect(movieModel.insertMany).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockMovieDomain);
    });
  });
});
