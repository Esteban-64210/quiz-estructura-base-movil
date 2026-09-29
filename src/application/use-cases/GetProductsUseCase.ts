import { Product } from '../../domain/models/Product';
import { IProductRepository } from '../../domain/repositories/IProductRepository';

export class GetProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }
}
