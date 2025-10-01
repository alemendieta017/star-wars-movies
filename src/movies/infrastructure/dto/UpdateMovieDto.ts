import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './CreateMovieDto';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {}
