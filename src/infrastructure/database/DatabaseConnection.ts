/**
 * DatabaseConnection.ts
 * Infraestructura: conexión única a SQLite con migraciones versionadas.
 * Usa PRAGMA user_version para controlar el esquema de forma reproducible y prevenir condiciones de carrera.
 */
import * as SQLite from 'expo-sqlite';

class DatabaseConnectionService {
  private static instance: DatabaseConnectionService;
  private db: SQLite.SQLiteDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): DatabaseConnectionService {
    if (!DatabaseConnectionService.instance) {
      DatabaseConnectionService.instance = new DatabaseConnectionService();
    }
    return DatabaseConnectionService.instance;
  }

  /**
   * Abre la base de datos y aplica migraciones si el esquema está desactualizado.
   * La promesa es compartida e idempotente para evitar carreras de inicialización.
   */
  public async init(): Promise<void> {
    if (!this.initPromise) {
      this.initPromise = (async () => {
        this.db = await SQLite.openDatabaseAsync('quiz_movil.db');
        await this.runMigrations(this.db);
      })();
    }
    return this.initPromise;
  }

  /** Devuelve la instancia de la base de datos ya inicializada. */
  private async getDb(): Promise<SQLite.SQLiteDatabase> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) {
      throw new Error('No fue posible inicializar la base de datos SQLite.');
    }
    return this.db;
  }

  /**
   * Aplica migraciones versionadas con PRAGMA user_version.
   */
  private async runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
    const result = await db.getFirstAsync<{ user_version: number }>(
      'PRAGMA user_version;'
    );
    const currentVersion = result?.user_version ?? 0;

    if (currentVersion < 1) {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS users (
          id          INTEGER PRIMARY KEY AUTOINCREMENT,
          username    TEXT    NOT NULL UNIQUE,
          email       TEXT    NOT NULL UNIQUE,
          password    TEXT    NOT NULL,
          created_at  TEXT    NOT NULL
        );

        CREATE TABLE IF NOT EXISTS products (
          id          INTEGER PRIMARY KEY AUTOINCREMENT,
          name        TEXT    NOT NULL,
          price       REAL    NOT NULL CHECK(price > 0),
          stock       INTEGER NOT NULL CHECK(stock >= 0),
          description TEXT,
          created_at  TEXT    NOT NULL
        );

        CREATE TABLE IF NOT EXISTS persons (
          id              INTEGER PRIMARY KEY AUTOINCREMENT,
          document_number TEXT    NOT NULL UNIQUE,
          first_name      TEXT    NOT NULL,
          last_name       TEXT    NOT NULL,
          phone           TEXT,
          created_at      TEXT    NOT NULL
        );

        PRAGMA user_version = 1;
      `);
    }
  }

  /**
   * Ejecuta una sentencia SQL de escritura (INSERT, UPDATE, DELETE).
   * Siempre usa parámetros enlazados para evitar inyección SQL.
   */
  public async execute(
    sql: string,
    params: (string | number | null)[] = []
  ): Promise<{ insertId: number }> {
    const db = await this.getDb();
    const result = await db.runAsync(sql, params);
    return { insertId: result.lastInsertRowId };
  }

  /**
   * Ejecuta una consulta SELECT y retorna todos los registros.
   * Siempre usa parámetros enlazados para evitar inyección SQL.
   */
  public async query<T>(
    sql: string,
    params: (string | number | null)[] = []
  ): Promise<T[]> {
    const db = await this.getDb();
    return await db.getAllAsync<T>(sql, params);
  }
}

export const DatabaseConnection = DatabaseConnectionService.getInstance();
