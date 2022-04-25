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
import { Item } from 'src/products/models/item.entity';

@Entity('cart_items')
export class CartItem {
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
  @ManyToMany((type) => Cart, (cart) => cart.cartItems, { eager: false })
  cart: Cart[];

  @ApiProperty({
    type: () => Item,
    description: 'Item',
  })
  @ManyToOne(() => Item, { eager: true })
  @JoinColumn({ name: 'item_id' })
  item: Item;

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
