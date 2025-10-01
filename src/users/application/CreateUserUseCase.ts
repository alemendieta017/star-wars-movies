import { Injectable, ConflictException } from '@nestjs/common';
import { UsersRepository } from '../domain/repositories/UsersRepository';
import { User } from '../domain/models/User';
import { RegisterDto } from '../infrastructure/dto/RegisterDto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.usersRepository.findByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user: User = {
      id: null,
      email: registerDto.email,
      password: hashedPassword,
      role: registerDto.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.usersRepository.createUser(user);
  }
}
