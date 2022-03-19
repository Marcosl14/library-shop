import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../models/cart.entity';

@Injectable()
export class CartService {
  constructor(@InjectRepository(Cart) private cartRepo: Repository<Cart>) {}

  async create(): Promise<Cart> {
    const cart: Cart = await this.cartRepo.create();
    return await this.cartRepo.save(cart);
  }
}
