import { User } from '../models/User';

export abstract class UsersRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract createUser(user: User): Promise<User>;
  abstract findById(id: string): Promise<User | null>;
}
