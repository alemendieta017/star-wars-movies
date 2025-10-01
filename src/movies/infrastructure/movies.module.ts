import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { SyncMoviesUseCase } from '../application/SyncMoviesUseCase';
import { MovieService } from '../domain/services/MovieService';
import { SwapiService } from './services/SwapiService';
import { MongoIdValidationPipe } from '../../shared/pipes/MongoIdValidationPipe';
import { AuthModule } from '../../auth/auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [
    ListMoviesUseCase,
    CreateMovieUseCase,
    GetMovieByIdUseCase,
    UpdateMovieUseCase,
    DeleteMovieUseCase,
    SyncMoviesUseCase,
    MongoIdValidationPipe,
    {
      provide: MoviesRepository,
      useClass: MongoMoviesRepository,
    },
    {
      provide: MovieService,
      useClass: SwapiService,
    },
    ConfigService,
  ],
  imports: [
    MongooseModule.forFeature([
      { name: MovieEntity.name, schema: MovieSchema },
    ]),
    ConfigModule,
    HttpModule,
    AuthModule,
  ],
  controllers: [MovieController],
})
export class MoviesModule {}
