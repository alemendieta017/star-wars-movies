import { Injectable } from '@nestjs/common';
import { MoviesRepository } from '../domain/repositories/MoviesRepository';
import { Movie } from '../domain/models/Movie';

@Injectable()
export class CreateMovieUseCase {
  constructor(private readonly moviesRepository: MoviesRepository) {}

  async execute(movie: Movie): Promise<Movie> {
    return this.moviesRepository.createMovie(movie);
  }
}
