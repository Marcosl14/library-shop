import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/models/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartItem } from './cart-item.entity';
import { CartOffer } from './cart-offer.entity';

@Entity('carts')
export class Cart {
  @ApiProperty({
    description: 'Cart id number',
    readOnly: true,
    type: Number,
  })
  @PrimaryGeneratedColumn({
    unsigned: true,
    type: 'bigint',
  })
  id: number;

  @ApiProperty({
    type: () => User,
    description: 'Owner of the cart',
  })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // @ApiHideProperty()
  // @RelationId((cart: Cart) => cart.user)
  // userId: number;

  @ApiProperty({
    nullable: true,
    example: [
      {
        id: '145',
        quantity: 8,
        item: {
          id: '441',
          title: 'Awesome Concrete Pants',
          description: 'Sleek Rubber Shoes',
          photo: 'http://lorempixel.com/640/480',
          price: 3708.23,
          discount: 98,
          brand: 'in',
          category: {
            id: '7',
            name: 'nihil',
          },
          priceWithDiscount: 74.16,
        },
      },
      {
        id: '1',
        quantity: 9,
        item: {
          id: '1671',
          title: 'Awesome Concrete Pizza',
          description: 'Intelligent Frozen Towels',
          photo: 'http://lorempixel.com/640/480',
          price: 1438.41,
          discount: 85,
          brand: 'est',
          category: {
            id: '10',
            name: 'eius',
          },
          priceWithDiscount: 215.76,
        },
      },
    ],
    description: 'Cart Items',
  })
  @ManyToMany((type) => CartItem, (cartItem) => cartItem.cart, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'cart_cart_items' })
  cartItems: CartItem[];

  // console.log() agregar ejemplo igual que en cartItems;
  @ManyToMany((type) => CartOffer, (cartOffer) => cartOffer.cart, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'cart_cart_offers' })
  cartOffers: CartOffer[];

  @ApiHideProperty()
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    select: false,
  })
  createdAt?: Date;

  @ApiHideProperty()
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    select: false,
  })
  updatedAt?: Date;

  @ApiHideProperty()
  @Column({
    name: 'purchased_at',
    type: 'timestamptz',
    default: null,
    select: false,
  })
  purchasedAt?: Date;
}
