import { User } from '../../domain/models/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

export class GetUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
