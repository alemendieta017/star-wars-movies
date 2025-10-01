import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsDateString()
  created: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsDateString()
  edited: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  starships: string[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  vehicles: string[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  planets: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  producer: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  episode_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  director: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  release_date: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  opening_crawl: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  characters: string[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  species: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  url: string;
}
