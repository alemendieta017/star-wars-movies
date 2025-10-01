import { ApiProperty } from '@nestjs/swagger';

export class Movie {
  @ApiProperty({
    description: 'ID único de la película',
    example: '507f1f77bcf86cd799439011',
    nullable: true,
  })
  id: string | null;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2014-12-10T14:23:31.880000Z',
  })
  created: Date;

  @ApiProperty({
    description: 'Fecha de última edición',
    example: '2014-12-20T19:49:45.256000Z',
  })
  edited: Date;

  @ApiProperty({
    description: 'Lista de URLs de naves espaciales',
    type: [String],
    example: [
      'https://swapi.dev/api/starships/2/',
      'https://swapi.dev/api/starships/3/',
    ],
  })
  starships: string[];

  @ApiProperty({
    description: 'Lista de URLs de vehículos',
    type: [String],
    example: [
      'https://swapi.dev/api/vehicles/4/',
      'https://swapi.dev/api/vehicles/6/',
    ],
  })
  vehicles: string[];

  @ApiProperty({
    description: 'Lista de URLs de planetas',
    type: [String],
    example: [
      'https://swapi.dev/api/planets/1/',
      'https://swapi.dev/api/planets/2/',
    ],
  })
  planets: string[];

  @ApiProperty({
    description: 'Productor de la película',
    example: 'Gary Kurtz, Rick McCallum',
  })
  producer: string;

  @ApiProperty({
    description: 'Título de la película',
    example: 'A New Hope',
  })
  title: string;

  @ApiProperty({
    description: 'Número de episodio',
    example: 4,
  })
  episode_id: number;

  @ApiProperty({
    description: 'Director de la película',
    example: 'George Lucas',
  })
  director: string;

  @ApiProperty({
    description: 'Fecha de lanzamiento',
    example: '1977-05-25',
  })
  release_date: string;

  @ApiProperty({
    description: 'Texto de apertura de la película',
    example:
      'It is a period of civil war. Rebel spaceships, striking from a hidden base, have won their first victory against the evil Galactic Empire.',
  })
  opening_crawl: string;

  @ApiProperty({
    description: 'Lista de URLs de personajes',
    type: [String],
    example: [
      'https://swapi.dev/api/people/1/',
      'https://swapi.dev/api/people/2/',
    ],
  })
  characters: string[];

  @ApiProperty({
    description: 'Lista de URLs de especies',
    type: [String],
    example: [
      'https://swapi.dev/api/species/1/',
      'https://swapi.dev/api/species/2/',
    ],
  })
  species: string[];

  @ApiProperty({
    description: 'URL de la película en la API de Star Wars',
    example: 'https://swapi.dev/api/films/1/',
  })
  url: string;
}
