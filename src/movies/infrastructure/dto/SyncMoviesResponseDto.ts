import { Movie } from '../../domain/models/Movie';

export class SyncMoviesResponseDto {
  message: string;
  syncedMovies: string[];
  totalCount: number;

  constructor(movies: Movie[]) {
    this.message = 'Movies synchronized successfully';
    this.syncedMovies = movies.map((movie) => movie.title);
    this.totalCount = movies.length;
  }
}
