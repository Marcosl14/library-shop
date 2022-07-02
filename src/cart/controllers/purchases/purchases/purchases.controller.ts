import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ApiOperation,
  ApiOkResponse,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/role.enum';
import { Cart } from 'src/cart/models/cart.entity';
import { GetPurchasesAsAdminDTO } from 'src/cart/models/get-purchases-as-admin-query.dto';
import { CartService } from 'src/cart/services/cart/cart.service';

@ApiBearerAuth()
@ApiTags('Purchases')
@Controller('purchases')
export class PurchasesController {
  constructor(
    private cartService: CartService,
    private eventEmitter: EventEmitter2,
  ) {}

  @HttpCode(200)
  @ApiOperation({
    summary: 'Get all the users purchases paginated - Only Admins',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Return a paginated list with all purchased carts',
    isArray: true,
    schema: {
      example: {
        items: [
          {
            id: '3',
            user: {
              firstname: 'marcos2',
              lastname: 'giordano2',
              phone: '+5493517571966',
              email: 'marcos_l14@hotmail.com',
            },
            cartItems: [
              {
                id: '5',
                quantity: 12,
                item: {
                  id: '2',
                  title: 'Practical Cotton Pizza',
                  description: 'Intelligent Cotton Fish',
                  photo: 'http://lorempixel.com/640/480',
                  price: 3987.68,
                  discount: 7,
                  brand: 'asperiores',
                  category: {
                    id: '9',
                    name: 'provident',
                  },
                  priceWithDiscount: 3708.54,
                },
              },
              {
                id: '6',
                quantity: 4,
                item: {
                  id: '125',
                  title: 'Small Plastic Fish',
                  description: 'Refined Fresh Shirt',
                  photo: 'http://lorempixel.com/640/480',
                  price: 9927.08,
                  discount: 58,
                  brand: 'vero',
                  category: {
                    id: '10',
                    name: 'voluptatem',
                  },
                  priceWithDiscount: 4169.37,
                },
              },
            ],
            cartOffers: [
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
          },
          {
            id: '1',
            user: {
              firstname: 'marcos',
              lastname: 'giordano',
              phone: '+5493517571966',
              email: 'marcos.giordano.l14@googlemail.com',
            },
            cartItems: [
              {
                id: '2',
                quantity: 10,
                item: {
                  id: '6',
                  title: 'Gorgeous Fresh Mouse',
                  description: 'Refined Concrete Shoes',
                  photo: 'http://lorempixel.com/640/480',
                  price: 4476.79,
                  discount: 63,
                  brand: 'culpa',
                  category: {
                    id: '4',
                    name: 'temporibus',
                  },
                  priceWithDiscount: 1656.41,
                },
              },
              {
                id: '1',
                quantity: 10,
                item: {
                  id: '2',
                  title: 'Practical Cotton Pizza',
                  description: 'Intelligent Cotton Fish',
                  photo: 'http://lorempixel.com/640/480',
                  price: 3987.68,
                  discount: 7,
                  brand: 'asperiores',
                  category: {
                    id: '9',
                    name: 'provident',
                  },
                  priceWithDiscount: 3708.54,
                },
              },
            ],
            cartOffers: [
              {
                id: '1',
                quantity: 10,
                offer: {
                  id: '6',
                  title: 'small fresh chips',
                  description: 'Generic Granite Ball',
                  photo: 'http://lorempixel.com/640/480',
                  price: 423.8,
                  discount: 47,
                  offerItems: [
                    {
                      id: '164',
                      quantity: 7,
                      item: {
                        id: '60',
                        title: 'Fantastic Steel Bike',
                        description: 'Tasty Soft Cheese',
                        photo: 'http://lorempixel.com/640/480',
                        price: 174.22,
                        discount: 33,
                        brand: 'aperiam',
                        category: {
                          id: '10',
                          name: 'voluptatem',
                        },
                        priceWithDiscount: 116.73,
                      },
                    },
                    {
                      id: '71',
                      quantity: 1,
                      item: {
                        id: '1672',
                        title: 'Handcrafted Metal Chicken',
                        description: 'Licensed Steel Keyboard',
                        photo: 'http://lorempixel.com/640/480',
                        price: 6172.67,
                        discount: 93,
                        brand: 'non',
                        category: {
                          id: '3',
                          name: 'ea',
                        },
                        priceWithDiscount: 432.09,
                      },
                    },
                    {
                      id: '23',
                      quantity: 8,
                      item: {
                        id: '685',
                        title: 'Awesome Granite Cheese',
                        description: 'Refined Wooden Pizza',
                        photo: 'http://lorempixel.com/640/480',
                        price: 3320.85,
                        discount: 29,
                        brand: 'amet',
                        category: {
                          id: '7',
                          name: 'ullam',
                        },
                        priceWithDiscount: 2357.8,
                      },
                    },
                    {
                      id: '128',
                      quantity: 1,
                      item: {
                        id: '558',
                        title: 'Intelligent Frozen Sausages',
                        description: 'Licensed Steel Ball',
                        photo: 'http://lorempixel.com/640/480',
                        price: 2417.05,
                        discount: 22,
                        brand: 'quam',
                        category: {
                          id: '6',
                          name: 'repellendus',
                        },
                        priceWithDiscount: 1885.3,
                      },
                    },
                  ],
                  priceWithDiscount: 224.61,
                },
              },
              {
                id: '2',
                quantity: 10,
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
                  ],
                  priceWithDiscount: 2537.73,
                },
              },
            ],
          },
        ],
        meta: {
          totalItems: 40,
          itemCount: 2,
          itemsPerPage: 24,
          totalPages: 2,
          currentPage: 1,
        },
      },
    },
  })
  @ApiResponse({
    description: 'User token not valid',
    status: 401.01,
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    description: 'User Role Validation failed',
    status: 403.01,
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
      },
    },
  })
  @Roles(Role.Admin)
  @Get('admin')
  async getAllPurchasesAsAdmin(
    @Query() getPurchasesAsAdminQueryDto: GetPurchasesAsAdminDTO,
  ) {
    return await this.cartService.getAllPurchasedCarts(
      getPurchasesAsAdminQueryDto,
    );
  }

  @HttpCode(200)
  @ApiOperation({
    summary: 'Get all the user purchases',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Return all purchased carts for that specific user',
    isArray: true,
    schema: {
      example: [
        {
          purchasedAt: '2022-04-30T23:13:23.129Z',
          cartItems: [
            {
              id: '2',
              quantity: 10,
              item: {
                id: '6',
                title: 'Gorgeous Fresh Mouse',
                description: 'Refined Concrete Shoes',
                photo: 'http://lorempixel.com/640/480',
                price: 4476.79,
                discount: 63,
                brand: 'culpa',
                category: {
                  id: '4',
                  name: 'temporibus',
                },
                priceWithDiscount: 1656.41,
              },
            },
            {
              id: '1',
              quantity: 10,
              item: {
                id: '2',
                title: 'Practical Cotton Pizza',
                description: 'Intelligent Cotton Fish',
                photo: 'http://lorempixel.com/640/480',
                price: 3987.68,
                discount: 7,
                brand: 'asperiores',
                category: {
                  id: '9',
                  name: 'provident',
                },
                priceWithDiscount: 3708.54,
              },
            },
          ],
          cartOffers: [
            {
              id: '1',
              quantity: 10,
              offer: {
                id: '6',
                title: 'small fresh chips',
                description: 'Generic Granite Ball',
                photo: 'http://lorempixel.com/640/480',
                price: 423.8,
                discount: 47,
                offerItems: [
                  {
                    id: '93',
                    quantity: 8,
                    item: {
                      id: '1294',
                      title: 'Incredible Frozen Fish',
                      description: 'Awesome Wooden Chair',
                      photo: 'http://lorempixel.com/640/480',
                      price: 9549.34,
                      discount: 26,
                      brand: 'commodi',
                      category: {
                        id: '3',
                        name: 'ea',
                      },
                      priceWithDiscount: 7066.51,
                    },
                  },
                  {
                    id: '49',
                    quantity: 2,
                    item: {
                      id: '763',
                      title: 'Small Rubber Sausages',
                      description: 'Unbranded Soft Fish',
                      photo: 'http://lorempixel.com/640/480',
                      price: 6113.6,
                      discount: 64,
                      brand: 'maxime',
                      category: {
                        id: '1',
                        name: 'ex',
                      },
                      priceWithDiscount: 2200.9,
                    },
                  },
                  {
                    id: '164',
                    quantity: 7,
                    item: {
                      id: '60',
                      title: 'Fantastic Steel Bike',
                      description: 'Tasty Soft Cheese',
                      photo: 'http://lorempixel.com/640/480',
                      price: 174.22,
                      discount: 33,
                      brand: 'aperiam',
                      category: {
                        id: '10',
                        name: 'voluptatem',
                      },
                      priceWithDiscount: 116.73,
                    },
                  },
                  {
                    id: '71',
                    quantity: 1,
                    item: {
                      id: '1672',
                      title: 'Handcrafted Metal Chicken',
                      description: 'Licensed Steel Keyboard',
                      photo: 'http://lorempixel.com/640/480',
                      price: 6172.67,
                      discount: 93,
                      brand: 'non',
                      category: {
                        id: '3',
                        name: 'ea',
                      },
                      priceWithDiscount: 432.09,
                    },
                  },
                  {
                    id: '128',
                    quantity: 1,
                    item: {
                      id: '558',
                      title: 'Intelligent Frozen Sausages',
                      description: 'Licensed Steel Ball',
                      photo: 'http://lorempixel.com/640/480',
                      price: 2417.05,
                      discount: 22,
                      brand: 'quam',
                      category: {
                        id: '6',
                        name: 'repellendus',
                      },
                      priceWithDiscount: 1885.3,
                    },
                  },
                  {
                    id: '23',
                    quantity: 8,
                    item: {
                      id: '685',
                      title: 'Awesome Granite Cheese',
                      description: 'Refined Wooden Pizza',
                      photo: 'http://lorempixel.com/640/480',
                      price: 3320.85,
                      discount: 29,
                      brand: 'amet',
                      category: {
                        id: '7',
                        name: 'ullam',
                      },
                      priceWithDiscount: 2357.8,
                    },
                  },
                ],
                priceWithDiscount: 224.61,
              },
            },
            {
              id: '2',
              quantity: 10,
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
          ],
        },
      ],
    },
  })
  @ApiResponse({
    description: 'User token not valid',
    status: 401.01,
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @Get()
  async getAllPurchasesAsUser(@Req() req) {
    return await this.cartService.getAllPurchasedCartsAsUser(req.user);
  }

  @HttpCode(201)
  @ApiOperation({
    summary: 'Send the current cart by email to sales department',
  })
  @ApiOkResponse({
    status: 201,
    description: 'Cart purchased',
  })
  @ApiResponse({
    description: 'User token not valid',
    status: 401.01,
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    description: 'The selected offer does not exist',
    status: 409.01,
    schema: {
      example: {
        statusCode: 404,
        message: 'EMPTY_CART',
      },
    },
  })
  @Post()
  async purchaseCart(@Req() req) {
    const user = req.user;
    const cart: Cart = await this.cartService.getByUserId(user);

    if (cart && cart.cartItems.length === 0 && cart.cartOffers.length === 0) {
      throw new HttpException('EMPTY_CART', HttpStatus.CONFLICT);
    }

    cart.purchasedAt = new Date();
    await this.cartService.save(cart);
    await this.cartService.create(user);

    this.eventEmitter.emit('purchase.created', user, cart);
  }
}
