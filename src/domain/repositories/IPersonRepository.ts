import { Person } from '../models/Person';

export interface IPersonRepository {
  save(person: Person): Promise<number>;
  findAll(): Promise<Person[]>;
}
