import { User } from '../users.schema';

export interface IUsersService {
  create(data: { email: string; password: string }): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}