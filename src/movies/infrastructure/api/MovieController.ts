import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { ListMoviesUseCase } from '../../application/ListMoviesUseCase';
import { CreateMovieUseCase } from '../../application/CreateMovieUseCase';
import { Movie } from '../../domain/models/Movie';
import { GetMovieByIdUseCase } from '../../application/GetMovieByIdUseCase';
import { UpdateMovieUseCase } from '../../application/UpdateMovieUseCase';
import { DeleteMovieUseCase } from '../../application/DeleteMovieUseCase';
import { CreateMovieDto } from '../dto/CreateMovieDto';
import { UpdateMovieDto } from '../dto/UpdateMovieDto';
import { ListMoviesDto } from '../dto/ListMoviesDto';
import { ListMoviesResponseDto } from '../dto/ListMoviesResponseDto';
import { MovieMapper } from '../mappers/MovieMapper';
import { MongoIdValidationPipe } from '../../../shared/pipes/MongoIdValidationPipe';
import { ListMoviesQuery } from '../../domain/repositories/MoviesRepository';

@Controller('movies')
export class MovieController {
  constructor(
    private readonly listMoviesUseCase: ListMoviesUseCase,
    private readonly createMoviesUseCase: CreateMovieUseCase,
    private readonly getMovieByIdUseCase: GetMovieByIdUseCase,
    private readonly updateMovieUseCase: UpdateMovieUseCase,
    private readonly deleteMovieUseCase: DeleteMovieUseCase,
  ) {}

  @Get()
  async getMovies(
    @Query() listMoviesDto: ListMoviesDto,
  ): Promise<ListMoviesResponseDto> {
    const query: ListMoviesQuery = {
      page: listMoviesDto.page || 1,
      rows: listMoviesDto.rows || 10,
    };

    const result = await this.listMoviesUseCase.execute(query);

    return new ListMoviesResponseDto(result.data, result.totalCount);
  }

  @Post()
  async createMovie(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = MovieMapper.fromCreateDto(createMovieDto);
    return this.createMoviesUseCase.execute(movie);
  }

  @Get(':id')
  async getMovieById(
    @Param('id', MongoIdValidationPipe) id: string,
  ): Promise<Movie> {
    return this.getMovieByIdUseCase.execute(id);
  }

  @Patch(':id')
  async updateMovie(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() movie: UpdateMovieDto,
  ): Promise<Movie> {
    const movieDomain = MovieMapper.fromUpdateDto(movie);
    return this.updateMovieUseCase.execute(id, movieDomain);
  }

  @Delete(':id')
  async deleteMovie(
    @Param('id', MongoIdValidationPipe) id: string,
  ): Promise<void> {
    return this.deleteMovieUseCase.execute(id);
  }
}
