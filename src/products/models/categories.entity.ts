import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Item } from './item.entity';

@Entity('categories')
export class Category {
  @ApiProperty({
    type: Number,
    description: 'The id of the category',
    example: 1,
    readOnly: true,
  })
  @PrimaryGeneratedColumn({
    unsigned: true,
    type: 'bigint',
  })
  id: number;

  @ApiProperty({
    type: String,
    maxLength: 100,
    description: 'The name of the category',
    example: 'Technology',
    nullable: false,
  })
  @Column({
    name: 'name',
    type: 'character varying',
    length: 100,
    nullable: false,
  })
  name: string;

  @ApiHideProperty()
  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    default: null,
    select: false,
  })
  deletedAt?: Date;

  @OneToMany(() => Item, (item) => item.category)
  items: Item[];
}
