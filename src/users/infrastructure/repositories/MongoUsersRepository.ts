import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../domain/repositories/UsersRepository';
import { User as UserEntity } from '../entities/UserEntity';
import { User as UserDomain } from '../../domain/models/User';
import { UserMapper } from '../mappers/UserMapper';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MongoUsersRepository implements UsersRepository {
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserDomain | null> {
    const result = await this.userModel.findOne({ email }).exec();
    return result ? UserMapper.toDomain(result) : null;
  }

  async createUser(user: UserDomain): Promise<UserDomain> {
    const result = await this.userModel.create(UserMapper.toPersistance(user));
    return UserMapper.toDomain(result);
  }

  async findById(id: string): Promise<UserDomain | null> {
    const result = await this.userModel.findById(id).exec();
    return result ? UserMapper.toDomain(result) : null;
  }
}
