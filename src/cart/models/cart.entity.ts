import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/models/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

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

  @ApiHideProperty()
  @RelationId((cart: Cart) => cart.user)
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
