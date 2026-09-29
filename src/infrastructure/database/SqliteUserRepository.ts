/**
 * SqliteUserRepository.ts
 * Implementación de IUserRepository usando SQLite.
 * Mapea y sanitiza errores de base de datos para no exponer detalles internos del motor.
 */
import { User } from '../../domain/models/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { DatabaseConnection } from './DatabaseConnection';

export class SqliteUserRepository implements IUserRepository {
  async save(user: User): Promise<number> {
    try {
      const sql = `
        INSERT INTO users (username, email, password, created_at)
        VALUES (?, ?, ?, ?);
      `;
      const params = [
        user.username,
        user.email,
        user.password,
        user.createdAt || new Date().toISOString(),
      ];

      const result = await DatabaseConnection.execute(sql, params);
      return result.insertId || 0;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : '';
      if (msg.includes('UNIQUE constraint failed: users.email')) {
        throw new Error('El correo electrónico ya se encuentra registrado.');
      }
      if (msg.includes('UNIQUE constraint failed: users.username')) {
        throw new Error('El nombre de usuario ya se encuentra registrado.');
      }
      throw new Error('No fue posible registrar el usuario en la base de datos.');
    }
  }

  async findAll(): Promise<User[]> {
    const sql = `
      SELECT id, username, email, password, created_at as createdAt
      FROM users
      ORDER BY id DESC;
    `;
    return await DatabaseConnection.query<User>(sql);
  }
}
