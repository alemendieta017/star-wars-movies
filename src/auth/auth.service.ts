import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/domain/repositories/UsersRepository';
import { User } from '../users/domain/models/User';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userWithoutPassword = {
      ...user,
      password: undefined,
    };
    return userWithoutPassword;
  }

  generateJwtToken(user: Omit<User, 'password'>): string {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  async validateJwtPayload(payload: {
    sub: string;
  }): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersRepository.findById(payload.sub);
    if (!user) {
      return null;
    }

    const userWithoutPassword = {
      ...user,
      password: undefined,
    };
    return userWithoutPassword;
  }
}
