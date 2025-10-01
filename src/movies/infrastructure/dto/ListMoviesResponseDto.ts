import { ApiProperty } from '@nestjs/swagger';
import { Movie } from '../../domain/models/Movie';

export class ListMoviesResponseDto {
  @ApiProperty({
    description: 'Lista de películas',
    type: [Movie],
  })
  movies: Movie[];

  @ApiProperty({
    description: 'Número total de películas',
    example: 6,
  })
  totalCount: number;

  constructor(movies: Movie[], totalCount: number) {
    this.movies = movies;
    this.totalCount = totalCount;
  }
}
