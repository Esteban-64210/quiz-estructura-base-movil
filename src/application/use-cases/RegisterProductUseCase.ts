import { Product } from '../../domain/models/Product';
import { IProductRepository } from '../../domain/repositories/IProductRepository';

export class RegisterProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(productData: {
    name: string;
    price: number;
    stock: number;
    description?: string;
  }): Promise<number> {
    const name = (productData.name || '').trim();

    if (!name) {
      throw new Error('El nombre del producto es obligatorio.');
    }
    if (name.length < 2) {
      throw new Error('El nombre del producto debe tener al menos 2 caracteres.');
    }

    if (
      typeof productData.price !== 'number' ||
      isNaN(productData.price) ||
      productData.price <= 0
    ) {
      throw new Error('El precio debe ser un número mayor a cero.');
    }

    if (
      typeof productData.stock !== 'number' ||
      isNaN(productData.stock) ||
      productData.stock < 0
    ) {
      throw new Error('El stock no puede ser un número negativo.');
    }

    const newProduct: Product = {
      name,
      price: Number(productData.price.toFixed(2)),
      stock: Math.floor(productData.stock),
      description: (productData.description || '').trim(),
      createdAt: new Date().toISOString(),
    };

    return await this.productRepository.save(newProduct);
  }
}
