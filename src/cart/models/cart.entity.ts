import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/models/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartItem } from './cart-item.entity';
import { CartOffer } from './cart-offer.entity';

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

  // @ApiHideProperty()
  // @RelationId((cart: Cart) => cart.user)
  // userId: number;

  @ApiProperty({
    nullable: true,
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
    description: 'Cart Items',
  })
  @ManyToMany((type) => CartItem, (cartItem) => cartItem.cart, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'cart_cart_items' })
  cartItems: CartItem[];

  @ApiProperty({
    nullable: true,
    example: [
      {
        id: '4',
        quantity: 2,
        offer: {
          id: '8',
          title: 'small steel tuna',
          description: 'Handmade Concrete Car',
          photo: 'http://lorempixel.com/640/480',
          price: 4028.14,
          discount: 37,
          offerItems: [
            {
              id: '127',
              quantity: 1,
              item: {
                id: '1155',
                title: 'Incredible Concrete Pants',
                description: 'Sleek Rubber Bike',
                photo: 'http://lorempixel.com/640/480',
                price: 1426.32,
                discount: 89,
                brand: 'eum',
                category: {
                  id: '1',
                  name: 'ex',
                },
                priceWithDiscount: 156.9,
              },
            },
            {
              id: '150',
              quantity: 10,
              item: {
                id: '1319',
                title: 'Handcrafted Fresh Mouse',
                description: 'Small Frozen Keyboard',
                photo: 'http://lorempixel.com/640/480',
                price: 1017.52,
                discount: 59,
                brand: 'laudantium',
                category: {
                  id: '1',
                  name: 'ex',
                },
                priceWithDiscount: 417.18,
              },
            },
            {
              id: '180',
              quantity: 8,
              item: {
                id: '437',
                title: 'Awesome Concrete Pizza',
                description: 'Tasty Plastic Tuna',
                photo: 'http://lorempixel.com/640/480',
                price: 4373.56,
                discount: 22,
                brand: 'quis',
                category: {
                  id: '2',
                  name: 'saepe',
                },
                priceWithDiscount: 3411.38,
              },
            },
            {
              id: '146',
              quantity: 9,
              item: {
                id: '1829',
                title: 'Practical Wooden Shirt',
                description: 'Licensed Rubber Fish',
                photo: 'http://lorempixel.com/640/480',
                price: 9507.69,
                discount: 46,
                brand: 'qui',
                category: {
                  id: '8',
                  name: 'velit',
                },
                priceWithDiscount: 5134.15,
              },
            },
            {
              id: '76',
              quantity: 6,
              item: {
                id: '98',
                title: 'Incredible Wooden Ball',
                description: 'Unbranded Plastic Chicken',
                photo: 'http://lorempixel.com/640/480',
                price: 366.23,
                discount: 57,
                brand: 'sit',
                category: {
                  id: '1',
                  name: 'ex',
                },
                priceWithDiscount: 157.48,
              },
            },
          ],
          priceWithDiscount: 2537.73,
        },
      },
      {
        id: '3',
        quantity: 8,
        offer: {
          id: '5',
          title: 'refined fresh computer',
          description: 'Intelligent Granite Shirt',
          photo: 'http://lorempixel.com/640/480',
          price: 7421.98,
          discount: 78,
          offerItems: [
            {
              id: '44',
              quantity: 7,
              item: {
                id: '1581',
                title: 'Generic Rubber Ball',
                description: 'Intelligent Granite Fish',
                photo: 'http://lorempixel.com/640/480',
                price: 1222.31,
                discount: 3,
                brand: 'accusantium',
                category: {
                  id: '5',
                  name: 'animi',
                },
                priceWithDiscount: 1185.64,
              },
            },
            {
              id: '167',
              quantity: 1,
              item: {
                id: '1155',
                title: 'Incredible Concrete Pants',
                description: 'Sleek Rubber Bike',
                photo: 'http://lorempixel.com/640/480',
                price: 1426.32,
                discount: 89,
                brand: 'eum',
                category: {
                  id: '1',
                  name: 'ex',
                },
                priceWithDiscount: 156.9,
              },
            },
            {
              id: '51',
              quantity: 10,
              item: {
                id: '1933',
                title: 'Handmade Rubber Chicken',
                description: 'Awesome Soft Car',
                photo: 'http://lorempixel.com/640/480',
                price: 3003.23,
                discount: 91,
                brand: 'et',
                category: {
                  id: '10',
                  name: 'voluptatem',
                },
                priceWithDiscount: 270.29,
              },
            },
            {
              id: '46',
              quantity: 10,
              item: {
                id: '721',
                title: 'Tasty Wooden Soap',
                description: 'Small Soft Pizza',
                photo: 'http://lorempixel.com/640/480',
                price: 9302.23,
                discount: 39,
                brand: 'vel',
                category: {
                  id: '10',
                  name: 'voluptatem',
                },
                priceWithDiscount: 5674.36,
              },
            },
          ],
          priceWithDiscount: 1632.84,
        },
      },
    ],
    description: 'Cart Offers',
  })
  @ManyToMany((type) => CartOffer, (cartOffer) => cartOffer.cart, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'cart_cart_offers' })
  cartOffers: CartOffer[];

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
