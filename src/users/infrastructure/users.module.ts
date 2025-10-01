import { Module, forwardRef } from '@nestjs/common';
import { CreateUserUseCase } from '../application/CreateUserUseCase';
import { UsersRepository } from '../domain/repositories/UsersRepository';
import { MongoUsersRepository } from './repositories/MongoUsersRepository';
import { User as UserEntity, UserSchema } from './entities/UserEntity';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './api/UserController';
import { AuthModule } from '../../auth/auth.module';

@Module({
  providers: [
    CreateUserUseCase,
    {
      provide: UsersRepository,
      useClass: MongoUsersRepository,
    },
  ],
  imports: [
    MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  exports: [UsersRepository],
})
export class UsersModule {}
