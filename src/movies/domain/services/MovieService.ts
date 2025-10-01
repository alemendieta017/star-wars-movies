import { Movie } from '../models/Movie';

export abstract class MovieService {
  abstract getFilms(): Promise<Movie[]>;
}
