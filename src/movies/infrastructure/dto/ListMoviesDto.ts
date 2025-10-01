import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class ListMoviesDto {
  @ApiProperty({
    description: 'Número de página',
    example: 1,
    minimum: 1,
    required: false,
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value as string))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Número de elementos por página',
    example: 10,
    minimum: 1,
    required: false,
    default: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value as string))
  @IsNumber()
  @Min(1)
  rows?: number = 10;
}
