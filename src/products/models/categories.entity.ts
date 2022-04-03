import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
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

  @OneToMany(() => Item, (item) => item.category)
  items: Item[];
}
