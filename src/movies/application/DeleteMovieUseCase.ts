import { Injectable } from '@nestjs/common';
import { MoviesRepository } from '../domain/repositories/MoviesRepository';

@Injectable()
export class DeleteMovieUseCase {
  constructor(private readonly moviesRepository: MoviesRepository) {}
  async execute(id: string): Promise<void> {
    return this.moviesRepository.deleteMovie(id);
  }
}
