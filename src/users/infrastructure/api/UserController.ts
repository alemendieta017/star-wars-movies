import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/CreateUserUseCase';
import { RegisterDto } from '../dto/RegisterDto';
import { AuthResponseDto } from '../../../auth/infrastructure/dto/AuthResponseDto';
import { AuthService } from '../../../auth/auth.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
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
