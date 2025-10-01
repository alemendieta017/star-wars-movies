import { Injectable, NotFoundException } from '@nestjs/common';
import {
  MoviesRepository,
  ListMoviesQuery,
  PaginatedResult,
} from '../../domain/repositories/MoviesRepository';
import { Movie as MovieEntity } from '../entities/MovieEntity';
import { Movie as MovieDomain } from '../../domain/models/Movie';
import { MovieMapper } from '../../infrastructure/mappers/MovieMapper';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MongoMoviesRepository implements MoviesRepository {
  constructor(
    @InjectModel(MovieEntity.name) private movieModel: Model<MovieEntity>,
  ) {}

  async getMovies(
    query?: ListMoviesQuery,
  ): Promise<PaginatedResult<MovieDomain>> {
    const page = query?.page || 1;
    const rows = query?.rows || 10;
    const skip = (page - 1) * rows;

    const [movies, totalCount] = await Promise.all([
      this.movieModel.find().skip(skip).limit(rows).exec(),
      this.movieModel.countDocuments().exec(),
    ]);

    return {
      data: MovieMapper.toDomainList(movies),
      totalCount,
    };
  }

  async createMovie(movie: MovieDomain): Promise<MovieDomain> {
    const result = await this.movieModel.create(
      MovieMapper.toPersistance(movie),
    );
    return MovieMapper.toDomain(result);
  }

  async getMovieById(id: string): Promise<MovieDomain> {
    const result = await this.movieModel.findById(id).exec();

    if (!result) {
      throw new NotFoundException('Movie not found');
    }

    return MovieMapper.toDomain(result);
  }

  async updateMovie(movie: MovieDomain): Promise<MovieDomain> {
    const result = await this.movieModel
      .findByIdAndUpdate(movie.id, MovieMapper.toPersistance(movie), {
        new: true,
      })
      .exec();

    if (!result) {
      throw new NotFoundException('Movie not found');
    }

    return MovieMapper.toDomain(result);
  }

  async deleteMovie(id: string): Promise<void> {
    const result = await this.movieModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException('Movie not found');
    }
  }
}
