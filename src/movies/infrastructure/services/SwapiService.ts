import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { MovieService } from '../../domain/services/MovieService';
import { Movie } from '../../domain/models/Movie';
import { MovieMapper } from '../mappers/MovieMapper';

export interface SwapiFilm {
  properties: {
    created: string;
    edited: string;
    starships: string[];
    vehicles: string[];
    planets: string[];
    producer: string;
    title: string;
    episode_id: number;
    director: string;
    release_date: string;
    opening_crawl: string;
    characters: string[];
    species: string[];
    url: string;
  };
  _id: string;
  description: string;
  uid: string;
  __v: number;
}

export interface SwapiResponse {
  message: string;
  result: SwapiFilm[];
  apiVersion: string;
  timestamp: string;
  support: {
    contact: string;
    donate: string;
    partnerDiscounts: any;
  };
  social: {
    discord: string;
    reddit: string;
    github: string;
  };
}

@Injectable()
export class SwapiService implements MovieService {
  private readonly logger = new Logger(SwapiService.name);
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl =
      this.configService.get<string>('SWAPI_URL') ||
      'https://www.swapi.tech/api';
  }

  async getFilms(): Promise<Movie[]> {
    this.logger.log('Starting to fetch films from SWAPI');

    try {
      const response = await firstValueFrom(
        this.httpService.get<SwapiResponse>(`${this.baseUrl}/films`),
      );

      if (!response?.data || response.data.message !== 'ok') {
        this.logger.error('SWAPI returned an error response');
        throw new HttpException(
          'SWAPI returned an error',
          HttpStatus.BAD_GATEWAY,
        );
      }

      const swapiFilms = response.data.result || [];
      this.logger.log(
        `Successfully fetched ${swapiFilms.length} films from SWAPI`,
      );

      const movies = MovieMapper.fromSwapiFilmList(swapiFilms);

      // Log each movie that was fetched
      movies.forEach((movie, index) => {
        this.logger.log(
          `Movie ${index + 1}: ${movie.title} (Episode ${movie.episode_id}) - Director: ${movie.director}`,
        );
      });

      this.logger.log(
        `Successfully mapped ${movies.length} films to domain entities`,
      );

      return movies;
    } catch (error: unknown) {
      this.logger.error('Failed to fetch films from SWAPI', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to fetch films from SWAPI',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
