/**
 * SqlitePersonRepository.ts
 * Implementación de IPersonRepository usando SQLite.
 * Mapea y sanitiza errores de base de datos para no exponer detalles internos del motor.
 */
import { Person } from '../../domain/models/Person';
import { IPersonRepository } from '../../domain/repositories/IPersonRepository';
import { DatabaseConnection } from './DatabaseConnection';

export class SqlitePersonRepository implements IPersonRepository {
  async save(person: Person): Promise<number> {
    try {
      const sql = `
        INSERT INTO persons (document_number, first_name, last_name, phone, created_at)
        VALUES (?, ?, ?, ?, ?);
      `;
      const params = [
        person.documentNumber,
        person.firstName,
        person.lastName,
        person.phone || '',
        person.createdAt || new Date().toISOString(),
      ];

      const result = await DatabaseConnection.execute(sql, params);
      return result.insertId || 0;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : '';
      if (msg.includes('UNIQUE constraint failed: persons.document_number')) {
        throw new Error('El número de documento ya se encuentra registrado.');
      }
      throw new Error('No fue posible registrar la persona en la base de datos.');
    }
  }

  async findAll(): Promise<Person[]> {
    const sql = `
      SELECT id, document_number as documentNumber, first_name as firstName, last_name as lastName, phone, created_at as createdAt
      FROM persons
      ORDER BY id DESC;
    `;
    return await DatabaseConnection.query<Person>(sql);
  }
}
