import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthResponseDto } from '../dto/AuthResponseDto';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { AuthService } from '../../auth.service';
import { User } from '../../../users/domain/models/User';
import { LoginDto } from '../dto/LoginDto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario y devuelve un token JWT',
  })
  @ApiBody({
    type: LoginDto,
    description: 'Credenciales de usuario para autenticación',
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: { user: Omit<User, 'password'> }): AuthResponseDto {
    const access_token = this.authService.generateJwtToken(req.user);

    return new AuthResponseDto(access_token, {
      id: req.user.id!,
      email: req.user.email,
      role: req.user.role,
    });
  }
}
