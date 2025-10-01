import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'test@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: ['ADMIN', 'USER'],
    example: 'USER',
  })
  role: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Token JWT para autenticación',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Información del usuario autenticado',
    type: UserResponseDto,
  })
  user: UserResponseDto;

  constructor(
    access_token: string,
    user: { id: string; email: string; role: string },
  ) {
    this.access_token = access_token;
    this.user = user;
  }
}
