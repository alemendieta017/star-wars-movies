import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateUserUseCase } from '../../application/CreateUserUseCase';
import { RegisterDto } from '../dto/RegisterDto';
import { AuthResponseDto } from '../../../auth/infrastructure/dto/AuthResponseDto';
import { AuthService } from '../../../auth/auth.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description: 'Crea un nuevo usuario en el sistema y devuelve un token JWT',
  })
  @ApiBody({
    type: RegisterDto,
    description: 'Datos del usuario a registrar',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 409,
    description: 'El email ya está registrado',
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    const user = await this.createUserUseCase.execute(registerDto);

    const access_token = this.authService.generateJwtToken(user);

    return new AuthResponseDto(access_token, {
      id: user.id!,
      email: user.email,
      role: user.role,
    });
  }
}
