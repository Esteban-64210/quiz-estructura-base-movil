/**
 * Sha256PasswordHasher.ts
 * Implementación de infraestructura para IPasswordHasher usando SHA-256 + Salt aleatoria.
 * Cumple con la buena práctica de seguridad de no almacenar contraseñas en texto plano ni sin sal.
 */
import { IPasswordHasher } from '../../application/ports/IPasswordHasher';

export class Sha256PasswordHasher implements IPasswordHasher {
  private static readonly SALT_LENGTH = 16;

  async hash(password: string): Promise<string> {
    const salt = this.generateSalt(Sha256PasswordHasher.SALT_LENGTH);
    const hash = await this.computeHash(`${salt}:${password}`);
    return `${salt}:${hash}`;
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    const parts = hashed.split(':');
    if (parts.length !== 2) return false;
    const [salt, originalHash] = parts;
    const computedHash = await this.computeHash(`${salt}:${plain}`);
    return computedHash === originalHash;
  }

  private generateSalt(length: number): string {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private async computeHash(message: string): Promise<string> {
    if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }

    return this.fallbackSha256(message);
  }

  private fallbackSha256(ascii: string): string {
    function rightRotate(value: number, amount: number) {
      return (value >>> amount) | (value << (32 - amount));
    }

    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    let i: number, j: number;
    let result = '';

    const words: number[] = [];
    const asciiBitLength = ascii.length * 8;

    let hash: number[] = [];
    const k: number[] = [];
    let primeCounter = 0;

    const isPrime = (n: number) => {
      for (let factor = 2; factor * factor <= n; factor++) {
        if (n % factor === 0) return false;
      }
      return true;
    };

    for (let candidate = 2; primeCounter < 64; candidate++) {
      if (isPrime(candidate)) {
        if (primeCounter < 8) {
          hash[primeCounter] = (mathPow(candidate, 1 / 2) * maxWord) | 0;
        }
        k[primeCounter] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
        primeCounter++;
      }
    }

    words[asciiBitLength >> 5] |= 0x80 << (24 - (asciiBitLength % 32));
    words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;

    for (i = 0; i < ascii.length; i++) {
      words[i >> 2] |= ascii.charCodeAt(i) << ((3 - (i % 4)) * 8);
    }

    for (j = 0; j < words.length; j += 16) {
      const w = words.slice(j, j + 16);
      const oldHash = hash.slice(0);

      for (i = 16; i < 64; i++) {
        const s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        const s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }

      let a = hash[0], b = hash[1], c = hash[2], d = hash[3];
      let e = hash[4], f = hash[5], g = hash[6], h = hash[7];

      for (i = 0; i < 64; i++) {
        const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
        const ch = (e & f) ^ (~e & g);
        const temp1 = (h + S1 + ch + k[i] + (w[i] | 0)) | 0;
        const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = (S0 + maj) | 0;

        h = g;
        g = f;
        f = e;
        e = (d + temp1) | 0;
        d = c;
        c = b;
        b = a;
        a = (temp1 + temp2) | 0;
      }

      hash[0] = (hash[0] + a) | 0;
      hash[1] = (hash[1] + b) | 0;
      hash[2] = (hash[2] + c) | 0;
      hash[3] = (hash[3] + d) | 0;
      hash[4] = (hash[4] + e) | 0;
      hash[5] = (hash[5] + f) | 0;
      hash[6] = (hash[6] + g) | 0;
      hash[7] = (hash[7] + h) | 0;
    }

    for (i = 0; i < 8; i++) {
      for (j = 3; j >= 0; j--) {
        const byte = (hash[i] >> (j * 8)) & 255;
        result += byte.toString(16).padStart(2, '0');
      }
    }
    return result;
  }
}
