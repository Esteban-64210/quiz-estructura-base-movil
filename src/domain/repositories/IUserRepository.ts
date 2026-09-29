import { User } from '../models/User';

export interface IUserRepository {
  save(user: User): Promise<number>;
  findAll(): Promise<User[]>;
}
