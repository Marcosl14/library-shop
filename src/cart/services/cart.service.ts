import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/models/user.entity';
import { Repository } from 'typeorm';
import { CartItem } from '../models/cart-item.entity';
import { CartOffer } from '../models/cart-offer.entity';
import { Cart } from '../models/cart.entity';
import { CreateCartDTO } from '../models/create-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
    @InjectRepository(CartOffer) private cartOfferRepo: Repository<CartOffer>,
  ) {}

  async getByUserId(user: User): Promise<Cart> {
    return this.cartRepo.findOne({ user });
  }

  async save(cart: Cart): Promise<void> {
    await this.cartRepo.save(cart);
  }

  async create(cartDTO: CreateCartDTO): Promise<Cart> {
    const cart: Cart = await this.cartRepo.create(cartDTO);
    return await this.cartRepo.save(cart);
  }

  async removeCartOffer(cartOffer: CartOffer): Promise<void> {
    await this.cartOfferRepo.remove(cartOffer);
  }

  async removeCartItem(cartItem: CartItem): Promise<void> {
    await this.cartItemRepo.remove(cartItem);
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
