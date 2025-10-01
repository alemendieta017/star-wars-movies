import { ApiProperty } from '@nestjs/swagger';
import { Movie } from '../../domain/models/Movie';

export class SyncMoviesResponseDto {
  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Movies synchronized successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Lista de títulos de películas sincronizadas',
    type: [String],
    example: ['A New Hope', 'The Empire Strikes Back', 'Return of the Jedi'],
  })
  syncedMovies: string[];

  @ApiProperty({
    description: 'Número total de películas sincronizadas',
    example: 3,
  })
  totalCount: number;

  constructor(movies: Movie[]) {
    this.message = 'Movies synchronized successfully';
    this.syncedMovies = movies.map((movie) => movie.title);
    this.totalCount = movies.length;
  }
}
