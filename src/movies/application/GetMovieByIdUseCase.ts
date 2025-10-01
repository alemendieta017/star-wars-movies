import { Injectable } from '@nestjs/common';
import { MoviesRepository } from '../domain/repositories/MoviesRepository';
import { Movie } from '../domain/models/Movie';

@Injectable()
export class GetMovieByIdUseCase {
  constructor(private readonly moviesRepository: MoviesRepository) {}

  async execute(id: string): Promise<Movie> {
    return this.moviesRepository.getMovieById(id);
  }
}
