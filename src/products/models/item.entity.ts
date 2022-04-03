import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  AfterLoad,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Category } from './categories.entity';

@Entity('items')
export class Item {
  @ApiProperty({
    description: 'Item Id Number',
    readOnly: true,
    type: Number,
  })
  @PrimaryGeneratedColumn({
    unsigned: true,
    type: 'bigint',
  })
  id: number;

  @ApiProperty({
    example: 'Lorem ipsum dolor sit amet, consectetuer adipiscin',
    description: 'Item title',
    nullable: false,
    maxLength: 100,
  })
  @Column({
    name: 'title',
    type: 'character varying',
    length: 100,
    nullable: false,
  })
  title: string;

  @ApiProperty({
    example: 'Lorem ipsum dolor sit amet, consectetuer adipiscin',
    description: 'Item Description',
    maxLength: 1000,
  })
  @IsOptional()
  @Column({
    name: 'description',
    type: 'character varying',
    length: 1000,
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    example: 'www.mypicture.com/347378jhdf32974987342_2347832756',
    description: 'Item Photo',
    maxLength: 1000,
  })
  @IsOptional()
  @Column({
    name: 'photo',
    type: 'character varying',
    length: 1000,
    nullable: true,
  })
  photo?: string;

  @ApiProperty({
    nullable: false,
    example: 999.99,
    description: 'Item Price',
    type: Number,
  })
  @IsNumber()
  @Min(0.01)
  @Column({
    name: 'price',
    type: 'float',
    nullable: false,
  })
  price: number;

  @ApiProperty({
    nullable: false,
    example: 0.25,
    description: 'Item Discount',
    type: Number,
  })
  @IsNumber()
  @Min(0)
  @Max(1)
  @Column({
    name: 'discount',
    type: 'int',
    nullable: true,
    default: null,
  })
  discount?: number;

  @ApiProperty({
    type: 'string',
    example: 'Pizzini',
    description: 'Brand of item',
  })
  @IsOptional()
  @Column({
    name: 'brand',
    type: 'character varying',
    length: 30,
    nullable: true,
  })
  brand?: string;

  @ApiProperty({
    type: Category,
    description: 'Item Category',
  })
  @ManyToOne(() => Category, { eager: true, nullable: false })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ApiHideProperty()
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: null,
  })
  createdAt?: Date;

  @ApiHideProperty()
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: null,
  })
  updatedAt?: Date;

  @ApiHideProperty()
  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    default: null,
  })
  deletedAt?: Date;

  priceWithDiscount: null;

  @AfterLoad()
  getpriceWithDiscount(): number {
    return this.price * this.discount;
  }
}
