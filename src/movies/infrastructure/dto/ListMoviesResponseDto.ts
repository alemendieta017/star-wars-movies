import { Movie } from '../../domain/models/Movie';

export class ListMoviesResponseDto {
  movies: Movie[];
  totalCount: number;

  constructor(movies: Movie[], totalCount: number) {
    this.movies = movies;
    this.totalCount = totalCount;
  }
}
