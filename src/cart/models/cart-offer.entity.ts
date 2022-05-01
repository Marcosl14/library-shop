import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Cart } from './cart.entity';
import { Offer } from 'src/products/models/offer.entity';

@Entity('cart_offers')
export class CartOffer {
  @ApiProperty({
    description: 'Cart-item Id Number',
    readOnly: true,
    type: Number,
  })
  @PrimaryGeneratedColumn({
    unsigned: true,
    type: 'bigint',
  })
  id: number;

  @ApiProperty({ type: () => Cart })
  @ManyToMany((type) => Cart, (cart) => cart.cartOffers, { eager: false })
  cart: Cart[];

  @ApiProperty({
    type: () => Offer,
    description: 'Offer',
  })
  @ManyToOne(() => Offer, { eager: true })
  @JoinColumn({ name: 'offer_id' })
  offer: Offer;

  @ApiProperty({
    nullable: false,
    example: 25.5,
    description: 'Offer Discount',
    type: Number,
  })
  @Column({
    name: 'quantity',
    type: 'integer',
    nullable: false,
    default: 1,
  })
  quantity: number;
}
