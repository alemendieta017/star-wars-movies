import { MovieMapper } from '../../../../../src/movies/infrastructure/mappers/MovieMapper';
import { Movie as MovieEntity } from '../../../../../src/movies/infrastructure/entities/MovieEntity';
import { Movie } from '../../../../../src/movies/domain/models/Movie';
import { CreateMovieDto } from '../../../../../src/movies/infrastructure/dto/CreateMovieDto';
import { UpdateMovieDto } from '../../../../../src/movies/infrastructure/dto/UpdateMovieDto';
import { SwapiFilm } from '../../../../../src/movies/infrastructure/services/SwapiService';
import { Types } from 'mongoose';

describe('MovieMapper', () => {
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

  const mockCreateMovieDto: CreateMovieDto = {
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
  };

  const mockSwapiFilm: SwapiFilm = {
    _id: 'film-id',
    description: 'A Star Wars film',
    uid: 'uid-123',
    __v: 0,
    properties: {
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
    },
  };

  describe('toDomain', () => {
    it('should map entity to domain model', () => {
      const result = MovieMapper.toDomain(mockMovieEntity);

      expect(result).toEqual(mockMovieDomain);
    });

    it('should handle null _id', () => {
      const entityWithoutId = { ...mockMovieEntity, _id: null };
      const result = MovieMapper.toDomain(entityWithoutId);

      expect(result.id).toBeNull();
    });
  });

  describe('toDomainList', () => {
    it('should map array of entities to domain models', () => {
      const entities = [mockMovieEntity];
      const result = MovieMapper.toDomainList(entities);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockMovieDomain);
    });

    it('should handle empty array', () => {
      const result = MovieMapper.toDomainList([]);

      expect(result).toEqual([]);
    });
  });

  describe('toPersistance', () => {
    it('should map domain model to persistence format', () => {
      const result = MovieMapper.toPersistance(mockMovieDomain);

      expect(result).toEqual({
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
      });
    });
  });

  describe('fromCreateDto', () => {
    it('should map create DTO to domain model', () => {
      const result = MovieMapper.fromCreateDto(mockCreateMovieDto);

      expect(result.id).toBeNull();
      expect(result.title).toBe('A New Hope');
      expect(result.episode_id).toBe(4);
      expect(result.director).toBe('George Lucas');
      expect(result.created).toEqual(new Date('2023-01-01T00:00:00.000Z'));
      expect(result.edited).toEqual(new Date('2023-01-02T00:00:00.000Z'));
    });
  });

  describe('fromUpdateDto', () => {
    it('should map update DTO to partial domain model with all fields', () => {
      const updateDto: UpdateMovieDto = {
        title: 'Updated Title',
        director: 'Updated Director',
        episode_id: 5,
        release_date: '1980-05-21',
        opening_crawl: 'Updated crawl...',
        producer: 'Updated Producer',
        characters: ['https://swapi.dev/api/people/2/'],
        planets: ['https://swapi.dev/api/planets/2/'],
        starships: ['https://swapi.dev/api/starships/3/'],
        vehicles: ['https://swapi.dev/api/vehicles/5/'],
        species: ['https://swapi.dev/api/species/2/'],
        url: 'https://swapi.dev/api/films/2/',
        created: '2023-01-03T00:00:00.000Z',
        edited: '2023-01-04T00:00:00.000Z',
      };

      const result = MovieMapper.fromUpdateDto(updateDto);

      expect(result).toEqual({
        title: 'Updated Title',
        director: 'Updated Director',
        episode_id: 5,
        release_date: '1980-05-21',
        opening_crawl: 'Updated crawl...',
        producer: 'Updated Producer',
        characters: ['https://swapi.dev/api/people/2/'],
        planets: ['https://swapi.dev/api/planets/2/'],
        starships: ['https://swapi.dev/api/starships/3/'],
        vehicles: ['https://swapi.dev/api/vehicles/5/'],
        species: ['https://swapi.dev/api/species/2/'],
        url: 'https://swapi.dev/api/films/2/',
        created: new Date('2023-01-03T00:00:00.000Z'),
        edited: new Date('2023-01-04T00:00:00.000Z'),
      });
    });

    it('should map update DTO with only some fields', () => {
      const updateDto: UpdateMovieDto = {
        title: 'Updated Title',
        director: 'Updated Director',
      };

      const result = MovieMapper.fromUpdateDto(updateDto);

      expect(result).toEqual({
        title: 'Updated Title',
        director: 'Updated Director',
      });
    });

    it('should return empty object for empty update DTO', () => {
      const updateDto: UpdateMovieDto = {};

      const result = MovieMapper.fromUpdateDto(updateDto);

      expect(result).toEqual({});
    });
  });

  describe('fromSwapiFilm', () => {
    it('should map SWAPI film to domain model', () => {
      const result = MovieMapper.fromSwapiFilm(mockSwapiFilm);

      expect(result.id).toBeNull();
      expect(result.title).toBe('A New Hope');
      expect(result.episode_id).toBe(4);
      expect(result.director).toBe('George Lucas');
      expect(result.created).toEqual(new Date('2023-01-01T00:00:00.000Z'));
      expect(result.edited).toEqual(new Date('2023-01-02T00:00:00.000Z'));
    });
  });

  describe('fromSwapiFilmList', () => {
    it('should map array of SWAPI films to domain models', () => {
      const swapiFilms = [mockSwapiFilm];
      const result = MovieMapper.fromSwapiFilmList(swapiFilms);

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('A New Hope');
      expect(result[0].episode_id).toBe(4);
    });

    it('should handle empty array', () => {
      const result = MovieMapper.fromSwapiFilmList([]);

      expect(result).toEqual([]);
    });
  });
});
