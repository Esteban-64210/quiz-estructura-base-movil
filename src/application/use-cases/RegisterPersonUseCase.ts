import { Person } from '../../domain/models/Person';
import { IPersonRepository } from '../../domain/repositories/IPersonRepository';

export class RegisterPersonUseCase {
  constructor(private readonly personRepository: IPersonRepository) {}

  async execute(personData: {
    documentNumber: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<number> {
    const documentNumber = (personData.documentNumber || '').trim();
    const firstName = (personData.firstName || '').trim();
    const lastName = (personData.lastName || '').trim();
    const phone = (personData.phone || '').trim();

    if (!documentNumber) {
      throw new Error('El número de documento es obligatorio.');
    }
    if (!/^\d{5,15}$/.test(documentNumber)) {
      throw new Error('El número de documento debe contener entre 5 y 15 dígitos numéricos.');
    }

    if (!firstName) {
      throw new Error('Los nombres son obligatorios.');
    }
    if (firstName.length < 2) {
      throw new Error('Los nombres deben tener al menos 2 caracteres.');
    }

    if (!lastName) {
      throw new Error('Los apellidos son obligatorios.');
    }
    if (lastName.length < 2) {
      throw new Error('Los apellidos deben tener al menos 2 caracteres.');
    }

    const newPerson: Person = {
      documentNumber,
      firstName,
      lastName,
      phone,
      createdAt: new Date().toISOString(),
    };

    return await this.personRepository.save(newPerson);
  }
}
