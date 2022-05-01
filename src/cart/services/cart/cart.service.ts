import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { CartItem } from 'src/cart/models/cart-item.entity';
import { CartOffer } from 'src/cart/models/cart-offer.entity';
import { Cart } from 'src/cart/models/cart.entity';
import { GetPurchasesAsAdminDTO } from 'src/cart/models/get-purchases-as-admin-query.dto';
import { User } from 'src/users/models/user.entity';
import { IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
    @InjectRepository(CartOffer) private cartOfferRepo: Repository<CartOffer>,
  ) {}

  async getByUserId(user: User): Promise<Cart> {
    return this.cartRepo.findOne({ user, purchasedAt: IsNull() });
  }

  async getAllPurchasedCartsAsUser(user?: User): Promise<Cart[]> {
    return await this.cartRepo.find({ user, purchasedAt: Not(IsNull()) });
  }

  async getAllPurchasedCarts(
    getPurchasesAsAdminQueryDto: GetPurchasesAsAdminDTO,
  ): Promise<Pagination<Cart>> {
    const purchases = await this.cartRepo
      .createQueryBuilder('cart')
      .select([
        'cart.id',
        'users.firstname',
        'users.lastname',
        'users.phone',
        'users.email',
      ])
      .addSelect(['cart.purchased_at'])
      .where({ purchasedAt: Not(IsNull()) })
      .leftJoin('cart.user', 'users')
      .leftJoinAndSelect('cart.cartItems', 'cart_items')
      .leftJoinAndSelect('cart_items.item', 'items')
      .leftJoinAndSelect('cart.cartOffers', 'cart_offers')
      .leftJoinAndSelect('cart_offers.offer', 'offers')
      .orderBy('cart.purchased_at', 'DESC');

    return paginate(purchases, {
      page: getPurchasesAsAdminQueryDto.page,
      limit: 24,
    });
  }

  async save(cart: Cart): Promise<void> {
    await this.cartRepo.save(cart);
  }

  async create(user: User): Promise<Cart> {
    const cart: Cart = await this.cartRepo.create();
    cart.user = user;
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
    this.create(user);
  }
}
