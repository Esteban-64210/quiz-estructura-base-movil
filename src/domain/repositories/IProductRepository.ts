import { Product } from '../models/Product';

export interface IProductRepository {
  save(product: Product): Promise<number>;
  findAll(): Promise<Product[]>;
}
