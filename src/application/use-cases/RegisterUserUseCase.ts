import { User } from '../../domain/models/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../ports/IPasswordHasher';

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher
  ) {}

  async execute(userData: { username: string; email: string; password: string }): Promise<number> {
    const username = (userData.username || '').trim();
    const email = (userData.email || '').trim().toLowerCase();
    const password = userData.password || '';

    if (!username) {
      throw new Error('El nombre de usuario es obligatorio.');
    }
    if (username.length < 3) {
      throw new Error('El nombre de usuario debe tener al menos 3 caracteres.');
    }

    if (!email) {
      throw new Error('El correo electrónico es obligatorio.');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('El formato del correo electrónico no es válido.');
    }

    if (!password) {
      throw new Error('La contraseña es obligatoria.');
    }
    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres.');
    }

    // Hashear contraseña con sal antes de persistir
    const hashedPassword = await this.passwordHasher.hash(password);

    const newUser: User = {
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    return await this.userRepository.save(newUser);
  }
}
