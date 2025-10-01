import { Movie } from '../models/Movie';

export interface ListMoviesQuery {
  page: number;
  rows: number;
}

export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
}

export abstract class MoviesRepository {
  abstract getMovies(query?: ListMoviesQuery): Promise<PaginatedResult<Movie>>;
  abstract getMovieById(id: string): Promise<Movie>;
  abstract createMovie(movie: Movie): Promise<Movie>;
  abstract updateMovie(movie: Movie): Promise<Movie>;
  abstract deleteMovie(id: string): Promise<void>;
}
