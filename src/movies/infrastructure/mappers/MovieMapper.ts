import { Movie as MovieEntity } from '../entities/MovieEntity';
import { Movie } from '../../domain/models/Movie';
import { CreateMovieDto } from '../dto/CreateMovieDto';
import { UpdateMovieDto } from '../dto/UpdateMovieDto';
import { SwapiFilm } from '../services/SwapiService';

export class MovieMapper {
  static toDomain(movieEntity: MovieEntity): Movie {
    return {
      id: movieEntity._id.toString() || null,
      created: new Date(movieEntity.created),
      edited: new Date(movieEntity.edited),
      starships: movieEntity.starships,
      vehicles: movieEntity.vehicles,
      planets: movieEntity.planets,
      producer: movieEntity.producer,
      title: movieEntity.title,
      episode_id: movieEntity.episode_id,
      director: movieEntity.director,
      release_date: movieEntity.release_date,
      opening_crawl: movieEntity.opening_crawl,
      characters: movieEntity.characters,
      species: movieEntity.species,
      url: movieEntity.url,
    };
  }

  static toDomainList(movieEntities: MovieEntity[]): Movie[] {
    return movieEntities.map((entity) => this.toDomain(entity));
  }

  static toPersistance(movieDomain: Movie): Partial<MovieEntity> {
    return {
      created: movieDomain.created.toISOString(),
      edited: movieDomain.edited.toISOString(),
      starships: movieDomain.starships,
      vehicles: movieDomain.vehicles,
      planets: movieDomain.planets,
      producer: movieDomain.producer,
      title: movieDomain.title,
      episode_id: movieDomain.episode_id,
      director: movieDomain.director,
      release_date: movieDomain.release_date,
      opening_crawl: movieDomain.opening_crawl,
      characters: movieDomain.characters,
      species: movieDomain.species,
      url: movieDomain.url,
    };
  }

  static fromCreateDto(createMovieDto: CreateMovieDto): Movie {
    return {
      id: null,
      created: new Date(createMovieDto.created),
      edited: new Date(createMovieDto.edited),
      starships: createMovieDto.starships,
      vehicles: createMovieDto.vehicles,
      planets: createMovieDto.planets,
      producer: createMovieDto.producer,
      title: createMovieDto.title,
      episode_id: createMovieDto.episode_id,
      director: createMovieDto.director,
      release_date: createMovieDto.release_date,
      opening_crawl: createMovieDto.opening_crawl,
      characters: createMovieDto.characters,
      species: createMovieDto.species,
      url: createMovieDto.url,
    };
  }

  static fromUpdateDto(updateMovieDto: UpdateMovieDto): Partial<Movie> {
    const partial: Partial<Movie> = {};

    if (updateMovieDto.created)
      partial.created = new Date(updateMovieDto.created);
    if (updateMovieDto.edited) partial.edited = new Date(updateMovieDto.edited);
    if (updateMovieDto.starships) partial.starships = updateMovieDto.starships;
    if (updateMovieDto.vehicles) partial.vehicles = updateMovieDto.vehicles;
    if (updateMovieDto.planets) partial.planets = updateMovieDto.planets;
    if (updateMovieDto.producer) partial.producer = updateMovieDto.producer;
    if (updateMovieDto.title) partial.title = updateMovieDto.title;
    if (updateMovieDto.episode_id)
      partial.episode_id = updateMovieDto.episode_id;
    if (updateMovieDto.director) partial.director = updateMovieDto.director;
    if (updateMovieDto.release_date)
      partial.release_date = updateMovieDto.release_date;
    if (updateMovieDto.opening_crawl)
      partial.opening_crawl = updateMovieDto.opening_crawl;
    if (updateMovieDto.characters)
      partial.characters = updateMovieDto.characters;
    if (updateMovieDto.species) partial.species = updateMovieDto.species;
    if (updateMovieDto.url) partial.url = updateMovieDto.url;

    return partial;
  }

  static fromSwapiFilm(swapiFilm: SwapiFilm): Movie {
    return {
      id: null,
      created: new Date(swapiFilm.properties.created),
      edited: new Date(swapiFilm.properties.edited),
      starships: swapiFilm.properties.starships,
      vehicles: swapiFilm.properties.vehicles,
      planets: swapiFilm.properties.planets,
      producer: swapiFilm.properties.producer,
      title: swapiFilm.properties.title,
      episode_id: swapiFilm.properties.episode_id,
      director: swapiFilm.properties.director,
      release_date: swapiFilm.properties.release_date,
      opening_crawl: swapiFilm.properties.opening_crawl,
      characters: swapiFilm.properties.characters,
      species: swapiFilm.properties.species,
      url: swapiFilm.properties.url,
    };
  }

  static fromSwapiFilmList(swapiFilms: SwapiFilm[]): Movie[] {
    return swapiFilms.map((film) => this.fromSwapiFilm(film));
  }
}
