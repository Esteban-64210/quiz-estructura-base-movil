/**
 * container.ts
 * Raíz de composición de la aplicación (Main).
 * Es el único punto donde se orquesta e inyecta la infraestructura concreta
 * en los casos de uso de la capa de aplicación (Inversión de Dependencias).
 */
import { SqliteUserRepository } from '../infrastructure/database/SqliteUserRepository';
import { SqliteProductRepository } from '../infrastructure/database/SqliteProductRepository';
import { SqlitePersonRepository } from '../infrastructure/database/SqlitePersonRepository';
import { Sha256PasswordHasher } from '../infrastructure/security/Sha256PasswordHasher';

import { RegisterUserUseCase } from '../application/use-cases/RegisterUserUseCase';
import { GetUsersUseCase } from '../application/use-cases/GetUsersUseCase';
import { RegisterProductUseCase } from '../application/use-cases/RegisterProductUseCase';
import { GetProductsUseCase } from '../application/use-cases/GetProductsUseCase';
import { RegisterPersonUseCase } from '../application/use-cases/RegisterPersonUseCase';
import { GetPersonsUseCase } from '../application/use-cases/GetPersonsUseCase';

// Instanciación de adaptadores de infraestructura
const userRepository = new SqliteUserRepository();
const productRepository = new SqliteProductRepository();
const personRepository = new SqlitePersonRepository();
const passwordHasher = new Sha256PasswordHasher();

// Casos de uso de Usuarios
export const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordHasher);
export const getUsersUseCase = new GetUsersUseCase(userRepository);

// Casos de uso de Productos
export const registerProductUseCase = new RegisterProductUseCase(productRepository);
export const getProductsUseCase = new GetProductsUseCase(productRepository);

// Casos de uso de Personas
export const registerPersonUseCase = new RegisterPersonUseCase(personRepository);
export const getPersonsUseCase = new GetPersonsUseCase(personRepository);
