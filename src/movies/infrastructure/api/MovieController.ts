import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ListMoviesUseCase } from '../../application/ListMoviesUseCase';
import { CreateMovieUseCase } from '../../application/CreateMovieUseCase';
import { Movie } from '../../domain/models/Movie';
import { GetMovieByIdUseCase } from '../../application/GetMovieByIdUseCase';
import { UpdateMovieUseCase } from '../../application/UpdateMovieUseCase';
import { DeleteMovieUseCase } from '../../application/DeleteMovieUseCase';
import { SyncMoviesUseCase } from '../../application/SyncMoviesUseCase';
import { CreateMovieDto } from '../dto/CreateMovieDto';
import { UpdateMovieDto } from '../dto/UpdateMovieDto';
import { ListMoviesDto } from '../dto/ListMoviesDto';
import { ListMoviesResponseDto } from '../dto/ListMoviesResponseDto';
import { SyncMoviesResponseDto } from '../dto/SyncMoviesResponseDto';
import { MovieMapper } from '../mappers/MovieMapper';
import { MongoIdValidationPipe } from '../../../shared/pipes/MongoIdValidationPipe';
import { ListMoviesQuery } from '../../domain/repositories/MoviesRepository';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { Role } from '../../../users/domain/models/Role';

@ApiTags('movies')
@Controller('movies')
export class MovieController {
  constructor(
    private readonly listMoviesUseCase: ListMoviesUseCase,
    private readonly createMoviesUseCase: CreateMovieUseCase,
    private readonly getMovieByIdUseCase: GetMovieByIdUseCase,
    private readonly updateMovieUseCase: UpdateMovieUseCase,
    private readonly deleteMovieUseCase: DeleteMovieUseCase,
    private readonly syncMoviesUseCase: SyncMoviesUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar películas',
    description: 'Obtiene una lista paginada de películas de Star Wars',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página (por defecto: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'rows',
    required: false,
    type: Number,
    description: 'Número de elementos por página (por defecto: 10)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de películas obtenida exitosamente',
    type: ListMoviesResponseDto,
  })
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
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Crear película',
    description: 'Crea una nueva película de Star Wars (solo administradores)',
  })
  @ApiBody({
    type: CreateMovieDto,
    description: 'Datos de la película a crear',
  })
  @ApiResponse({
    status: 201,
    description: 'Película creada exitosamente',
    type: Movie,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - se requiere rol de administrador',
  })
  async createMovie(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = MovieMapper.fromCreateDto(createMovieDto);
    return this.createMoviesUseCase.execute(movie);
  }

  @Get(':id')
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obtener película por ID',
    description:
      'Obtiene una película específica por su ID (requiere autenticación)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la película',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Película encontrada exitosamente',
    type: Movie,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Película no encontrada',
  })
  async getMovieById(
    @Param('id', MongoIdValidationPipe) id: string,
  ): Promise<Movie> {
    return this.getMovieByIdUseCase.execute(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Actualizar película',
    description: 'Actualiza una película existente (solo administradores)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la película a actualizar',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({
    type: UpdateMovieDto,
    description: 'Datos de la película a actualizar',
  })
  @ApiResponse({
    status: 200,
    description: 'Película actualizada exitosamente',
    type: Movie,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - se requiere rol de administrador',
  })
  @ApiResponse({
    status: 404,
    description: 'Película no encontrada',
  })
  async updateMovie(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() movie: UpdateMovieDto,
  ): Promise<Movie> {
    const movieDomain = MovieMapper.fromUpdateDto(movie);
    return this.updateMovieUseCase.execute(id, movieDomain);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Eliminar película',
    description: 'Elimina una película del sistema (solo administradores)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la película a eliminar',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Película eliminada exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - se requiere rol de administrador',
  })
  @ApiResponse({
    status: 404,
    description: 'Película no encontrada',
  })
  async deleteMovie(
    @Param('id', MongoIdValidationPipe) id: string,
  ): Promise<void> {
    return this.deleteMovieUseCase.execute(id);
  }

  @Post('sync')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Sincronizar películas',
    description:
      'Sincroniza las películas desde la API externa de Star Wars (solo administradores)',
  })
  @ApiResponse({
    status: 200,
    description: 'Películas sincronizadas exitosamente',
    type: SyncMoviesResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - se requiere rol de administrador',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async syncMovies(): Promise<SyncMoviesResponseDto> {
    const movies = await this.syncMoviesUseCase.execute();
    return new SyncMoviesResponseDto(movies);
  }
}
