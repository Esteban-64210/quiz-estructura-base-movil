/**
 * IPasswordHasher.ts
 * Puerto de aplicación: contrato para servicio de hash de contraseñas.
 * Permite que los casos de uso dependan de una abstracción y no de librerías criptográficas de bajo nivel.
 */
export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  compare(plain: string, hashed: string): Promise<boolean>;
}
