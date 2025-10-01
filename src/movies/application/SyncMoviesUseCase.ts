import { Injectable } from '@nestjs/common';
import { MoviesRepository } from '../domain/repositories/MoviesRepository';
import { Movie } from '../domain/models/Movie';
import { MovieService } from '../domain/services/MovieService';

@Injectable()
export class SyncMoviesUseCase {
  constructor(
    private readonly moviesRepository: MoviesRepository,
    private readonly movieService: MovieService,
  ) {}

  async execute(): Promise<Movie[]> {
    const movies = await this.movieService.getFilms();

    await this.moviesRepository.deleteAllMovies();

    const createdMovies = await this.moviesRepository.createMovies(movies);

    return createdMovies;
  }
}
