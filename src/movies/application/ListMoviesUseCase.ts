import { Injectable } from '@nestjs/common';
import {
  MoviesRepository,
  ListMoviesQuery,
  PaginatedResult,
} from '../domain/repositories/MoviesRepository';
import { Movie } from '../domain/models/Movie';

@Injectable()
export class ListMoviesUseCase {
  constructor(private readonly moviesRepository: MoviesRepository) {}

  async execute(query?: ListMoviesQuery): Promise<PaginatedResult<Movie>> {
    return this.moviesRepository.getMovies(query);
  }
}
