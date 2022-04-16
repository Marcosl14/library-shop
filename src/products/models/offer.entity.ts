import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  AfterLoad,
  BeforeInsert,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Item } from './item.entity';

@Entity('offers')
export class Offer {
  @ApiProperty({
    description: 'Offer Id Number',
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
    description: 'Offer title',
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
    description: 'Offer Description',
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
    description: 'Offer Photo',
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
    description: 'Offer Price',
    type: Number,
  })
  @Column({
    name: 'price',
    type: 'decimal',
    precision: 13,
    scale: 2,
    nullable: false,
  })
  price: number;

  @ApiProperty({
    nullable: false,
    example: 25.5,
    description: 'Offer Discount',
    type: Number,
  })
  @Column({
    name: 'discount',
    type: 'decimal',
    precision: 13,
    scale: 2,
    nullable: true,
    default: 0,
  })
  discount?: number;

  @ApiProperty({
    nullable: false,
    example: 155.24,
    description: 'Offer Price With Discount',
    type: Number,
  })
  priceWithDiscount: number;

  @ApiProperty({
    nullable: false,
    example: [
      {
        id: '2000',
        title: 'Awesome Cotton Bike',
        description: 'Sleek Concrete Tuna',
        photo: 'http://lorempixel.com/640/480',
        price: 4533.61,
        discount: 56,
        brand: 'cupiditate',
        category: {
          id: '1',
          name: 'consectetur',
        },
        priceWithDiscount: 1994.79,
      },
      {
        id: '1549',
        title: 'Awesome Frozen Chips',
        description: 'Handcrafted Granite Fish',
        photo: 'http://lorempixel.com/640/480',
        price: 8152.45,
        discount: 31,
        brand: 'aliquid',
        category: {
          id: '1',
          name: 'consectetur',
        },
        priceWithDiscount: 5625.19,
      },
    ],
    description: 'Offer Items',
  })
  @ManyToMany((type) => Item, (item) => item.offers, { eager: true })
  @JoinTable()
  items: Item[];

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
  getpriceWithDiscount() {
    this.priceWithDiscount = parseFloat(
      (this.price * (1 - this.discount / 100)).toFixed(2),
    );
  }

  @AfterLoad()
  converttoNumbers() {
    this.price = parseFloat(this.price.toString());
    this.discount = parseFloat(this.discount.toString());
  }

  @BeforeInsert()
  async lowerCaseAtributes() {
    this.title = this.title ? this.title.toLowerCase() : this.title;
  }
}
