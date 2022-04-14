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
  BeforeInsert,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
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
  @Column({
    name: 'price',
    type: 'float',
    nullable: false,
  })
  price: number;

  @ApiProperty({
    nullable: false,
    example: 25,
    description: 'Item Discount',
    type: Number,
  })
  @Column({
    name: 'discount',
    type: 'int',
    nullable: true,
    default: 0,
  })
  discount?: number;

  @ApiProperty({
    nullable: false,
    example: 155.24,
    description: 'Item Price With Discount',
    type: Number,
  })
  priceWithDiscount: number;

  @ApiProperty({
    type: 'string',
    example: 'Pizzini',
    description: 'Brand of item',
  })
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
  @ManyToOne(() => Category, { eager: true, nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ApiHideProperty()
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: null,
    select: false,
  })
  createdAt?: Date;

  @ApiHideProperty()
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: null,
    select: false,
  })
  updatedAt?: Date;

  @ApiHideProperty()
  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    default: null,
    select: false,
  })
  deletedAt?: Date;

  @AfterLoad()
  getpriceWithDiscount(): number {
    return (this.priceWithDiscount = this.price * (1 - this.discount / 100));
  }

  @BeforeInsert()
  async lowerCaseAtributes() {
    this.title = this.title ? this.title.toLowerCase() : this.title;
    this.brand = this.brand ? this.title.toLowerCase() : this.brand;
  }
}
