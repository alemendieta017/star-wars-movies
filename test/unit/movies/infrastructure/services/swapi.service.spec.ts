import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import {
  SwapiService,
  SwapiResponse,
} from '../../../../../src/movies/infrastructure/services/SwapiService';

describe('SwapiService', () => {
  let service: SwapiService;
  let httpService: jest.Mocked<HttpService>;
  let configService: jest.Mocked<ConfigService>;

  const mockSwapiResponse: SwapiResponse = {
    message: 'ok',
    result: [
      {
        _id: 'film-id-1',
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
      },
      {
        _id: 'film-id-2',
        description: 'Another Star Wars film',
        uid: 'uid-456',
        __v: 0,
        properties: {
          created: '2023-01-01T00:00:00.000Z',
          edited: '2023-01-02T00:00:00.000Z',
          starships: ['https://swapi.dev/api/starships/3/'],
          vehicles: ['https://swapi.dev/api/vehicles/5/'],
          planets: ['https://swapi.dev/api/planets/2/'],
          producer: 'Gary Kurtz',
          title: 'The Empire Strikes Back',
          episode_id: 5,
          director: 'Irvin Kershner',
          release_date: '1980-05-21',
          opening_crawl: 'It is a dark time...',
          characters: ['https://swapi.dev/api/people/2/'],
          species: ['https://swapi.dev/api/species/2/'],
          url: 'https://swapi.dev/api/films/2/',
        },
      },
    ],
    apiVersion: '1.0',
    timestamp: '2023-01-01T00:00:00.000Z',
    support: {
      contact: 'support@swapi.tech',
      donate: 'https://swapi.tech/donate',
      partnerDiscounts: {},
    },
    social: {
      discord: 'https://discord.gg/swapi',
      reddit: 'https://reddit.com/r/swapi',
      github: 'https://github.com/swapi',
    },
  };

  beforeEach(async () => {
    const mockHttpService = {
      get: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SwapiService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<SwapiService>(SwapiService);
    httpService = module.get(HttpService);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFilms', () => {
    it('should fetch and return films successfully', async () => {
      configService.get.mockReturnValue('https://www.swapi.tech/api');
      httpService.get.mockReturnValue(of({ data: mockSwapiResponse }));

      const result = await service.getFilms();

      expect(httpService.get).toHaveBeenCalledWith(
        'https://www.swapi.tech/api/films',
      );
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('A New Hope');
      expect(result[0].episode_id).toBe(4);
      expect(result[0].director).toBe('George Lucas');
      expect(result[1].title).toBe('The Empire Strikes Back');
      expect(result[1].episode_id).toBe(5);
      expect(result[1].director).toBe('Irvin Kershner');
    });

    it('should use default URL when config is not provided', async () => {
      configService.get.mockReturnValue(undefined);
      httpService.get.mockReturnValue(of({ data: mockSwapiResponse }));

      await service.getFilms();

      expect(httpService.get).toHaveBeenCalledWith(
        'https://www.swapi.tech/api/films',
      );
    });

    it('should handle empty result array', async () => {
      configService.get.mockReturnValue('https://www.swapi.tech/api');
      const emptyResponse = { ...mockSwapiResponse, result: [] };
      httpService.get.mockReturnValue(of({ data: emptyResponse }));

      const result = await service.getFilms();

      expect(result).toHaveLength(0);
    });

    it('should handle null result', async () => {
      configService.get.mockReturnValue('https://www.swapi.tech/api');
      const nullResultResponse = { ...mockSwapiResponse, result: null };
      httpService.get.mockReturnValue(of({ data: nullResultResponse }));

      const result = await service.getFilms();

      expect(result).toHaveLength(0);
    });

    it('should throw HttpException when SWAPI returns error message', async () => {
      configService.get.mockReturnValue('https://www.swapi.tech/api');
      const errorResponse = { ...mockSwapiResponse, message: 'error' };
      httpService.get.mockReturnValue(of({ data: errorResponse }));

      await expect(service.getFilms()).rejects.toThrow(
        new HttpException('SWAPI returned an error', HttpStatus.BAD_GATEWAY),
      );
    });

    it('should throw HttpException when response data is null', async () => {
      configService.get.mockReturnValue('https://www.swapi.tech/api');
      httpService.get.mockReturnValue(of({ data: null }));

      await expect(service.getFilms()).rejects.toThrow(
        new HttpException('SWAPI returned an error', HttpStatus.BAD_GATEWAY),
      );
    });

    it('should throw HttpException when HTTP request fails', async () => {
      configService.get.mockReturnValue('https://www.swapi.tech/api');
      const error = new Error('Network error');
      httpService.get.mockReturnValue(throwError(() => error));

      await expect(service.getFilms()).rejects.toThrow(
        new HttpException(
          'Failed to fetch films from SWAPI',
          HttpStatus.SERVICE_UNAVAILABLE,
        ),
      );
    });

    it('should rethrow HttpException when it is already an HttpException', async () => {
      configService.get.mockReturnValue('https://www.swapi.tech/api');
      const httpError = new HttpException(
        'Custom error',
        HttpStatus.BAD_REQUEST,
      );
      httpService.get.mockReturnValue(throwError(() => httpError));

      await expect(service.getFilms()).rejects.toThrow(httpError);
    });

    it('should handle undefined response', async () => {
      configService.get.mockReturnValue('https://www.swapi.tech/api');
      httpService.get.mockReturnValue(of({ data: undefined }));

      await expect(service.getFilms()).rejects.toThrow(
        new HttpException('SWAPI returned an error', HttpStatus.BAD_GATEWAY),
      );
    });
  });
});
