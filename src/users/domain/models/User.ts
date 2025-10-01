import { Role } from './Role';

export class User {
  id: string | null;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
