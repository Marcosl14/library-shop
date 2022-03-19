import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('carts')
export class Cart {
  @ApiProperty({
    description: 'Cart id number',
    type: Number,
  })
  @PrimaryGeneratedColumn({
    unsigned: true,
    type: 'bigint',
  })
  id: number;

  @ApiHideProperty()
  @Column({
    name: 'user_id',
    type: 'bigint',
  })
  userId: number;

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
