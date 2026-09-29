import { Person } from '../../domain/models/Person';
import { IPersonRepository } from '../../domain/repositories/IPersonRepository';

export class GetPersonsUseCase {
  constructor(private readonly personRepository: IPersonRepository) {}

  async execute(): Promise<Person[]> {
    return await this.personRepository.findAll();
  }
}
