import { Module } from '@nestjs/common';
import { ListMoviesUseCase } from '../application/ListMoviesUseCase';
import { MoviesRepository } from '../domain/repositories/MoviesRepository';
import { MongoMoviesRepository } from './repositories/MongoMoviesRepository';
import { Movie as MovieEntity, MovieSchema } from './entities/MovieEntity';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieController } from './api/MovieController';
import { CreateMovieUseCase } from '../application/CreateMovieUseCase';
import { UpdateMovieUseCase } from '../application/UpdateMovieUseCase';
import { DeleteMovieUseCase } from '../application/DeleteMovieUseCase';
import { GetMovieByIdUseCase } from '../application/GetMovieByIdUseCase';
import { MongoIdValidationPipe } from '../../shared/pipes/MongoIdValidationPipe';
import { AuthModule } from '../../auth/auth.module';

@Module({
  providers: [
    ListMoviesUseCase,
    CreateMovieUseCase,
    GetMovieByIdUseCase,
    UpdateMovieUseCase,
    DeleteMovieUseCase,
    MongoIdValidationPipe,
    {
      provide: MoviesRepository,
      useClass: MongoMoviesRepository,
    },
  ],
  imports: [
    MongooseModule.forFeature([
      { name: MovieEntity.name, schema: MovieSchema },
    ]),
    AuthModule,
  ],
  controllers: [MovieController],
})
export class MoviesModule {}
