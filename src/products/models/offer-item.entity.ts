import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Item } from './item.entity';
import { Offer } from './offer.entity';

@Entity('offer_items')
export class OfferItem {
  @ApiProperty({
    description: 'Offer-item Id Number',
    readOnly: true,
    type: Number,
  })
  @PrimaryGeneratedColumn({
    unsigned: true,
    type: 'bigint',
  })
  id: number;

  @ApiProperty({ type: () => Offer })
  @ManyToMany((type) => Offer, (offer) => offer.offerItems, { eager: false })
  offers: Offer[];

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
