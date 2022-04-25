import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/models/user.entity';
import { Repository } from 'typeorm';
import { Cart } from '../models/cart.entity';
import { CreateCartDTO } from '../models/create-cart.dto';

@Injectable()
export class CartService {
  constructor(@InjectRepository(Cart) private cartRepo: Repository<Cart>) {}

  async getByUserId(user: User): Promise<Cart> {
    return this.cartRepo.findOne({ user });
  }

  async addToCart(cart: Cart): Promise<void> {
    await this.cartRepo.save(cart);
  }

  async create(cartDTO: CreateCartDTO): Promise<Cart> {
    const cart: Cart = await this.cartRepo.create(cartDTO);
    return await this.cartRepo.save(cart);
  }

  // console.log();
  // debería haber otro evento para crear carrito, cuando la compra del carrito actual fue efectuada.
  // ver bien la lógica de creación del carrito. Si algo pasa durante la creación (al momento del registro del usuario), entonces siempre
  // debemos validar que si el carrito no existe, entonces que lo intente crear nuevamente.
  @OnEvent(['registration.in_progress'])
  handleUserCreatedEvent(user: User) {
    const cart: CreateCartDTO = new CreateCartDTO();
    cart.user = user;
    this.create(cart);
  }
}
