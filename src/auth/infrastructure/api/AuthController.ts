import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthResponseDto } from '../dto/AuthResponseDto';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { AuthService } from '../../auth.service';
import { User } from '../../../users/domain/models/User';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
