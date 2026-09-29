/**
 * SqliteProductRepository.ts
 * Implementación de IProductRepository usando SQLite.
 * Mapea y sanitiza errores de base de datos para no exponer detalles internos del motor.
 */
import { Product } from '../../domain/models/Product';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { DatabaseConnection } from './DatabaseConnection';

export class SqliteProductRepository implements IProductRepository {
  async save(product: Product): Promise<number> {
    try {
      const sql = `
        INSERT INTO products (name, price, stock, description, created_at)
        VALUES (?, ?, ?, ?, ?);
      `;
      const params = [
        product.name,
        product.price,
        product.stock,
        product.description || '',
        product.createdAt || new Date().toISOString(),
      ];

      const result = await DatabaseConnection.execute(sql, params);
      return result.insertId || 0;
    } catch {
      throw new Error('No fue posible registrar el producto en la base de datos.');
    }
  }

  async findAll(): Promise<Product[]> {
    const sql = `
      SELECT id, name, price, stock, description, created_at as createdAt
      FROM products
      ORDER BY id DESC;
    `;
    return await DatabaseConnection.query<Product>(sql);
  }
}
