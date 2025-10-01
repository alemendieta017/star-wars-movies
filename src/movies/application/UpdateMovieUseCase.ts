import { Movie } from '../domain/models/Movie';
import { MoviesRepository } from '../domain/repositories/MoviesRepository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateMovieUseCase {
  constructor(private readonly moviesRepository: MoviesRepository) {}
  async execute(id: string, movie: Partial<Movie>): Promise<Movie> {
    const existingMovie = await this.moviesRepository.getMovieById(id);
    const updatedMovie = { ...existingMovie, ...movie, id };
    return this.moviesRepository.updateMovie(updatedMovie);
  }
}
