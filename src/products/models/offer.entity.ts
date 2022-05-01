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
import { OfferItem } from './offer-item.entity';

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
    nullable: true,
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
        id: '145',
        quantity: 8,
        item: {
          id: '441',
          title: 'Awesome Concrete Pants',
          description: 'Sleek Rubber Shoes',
          photo: 'http://lorempixel.com/640/480',
          price: 3708.23,
          discount: 98,
          brand: 'in',
          category: {
            id: '7',
            name: 'nihil',
          },
          priceWithDiscount: 74.16,
        },
      },
      {
        id: '1',
        quantity: 9,
        item: {
          id: '1671',
          title: 'Awesome Concrete Pizza',
          description: 'Intelligent Frozen Towels',
          photo: 'http://lorempixel.com/640/480',
          price: 1438.41,
          discount: 85,
          brand: 'est',
          category: {
            id: '10',
            name: 'eius',
          },
          priceWithDiscount: 215.76,
        },
      },
    ],
    description: 'Offer Items',
  })
  @ManyToMany((type) => OfferItem, (offerItem) => offerItem.offers, {
    eager: true,
  })
  @JoinTable({ name: 'offers_offer_items' })
  offerItems: OfferItem[];

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
