import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AddToCartDTO } from 'src/cart/models/add-to-cart.dto';
import { CartItem } from 'src/cart/models/cart-item.entity';
import { CartOffer } from 'src/cart/models/cart-offer.entity';
import { Cart } from 'src/cart/models/cart.entity';
import { RemoveFromCartDTO } from 'src/cart/models/remove-from-cart.dto';
import { CartProductType } from 'src/cart/models/type.enum';
import { CartService } from 'src/cart/services/cart/cart.service';
import { ItemsService } from 'src/products/services/items/items.service';
import { OffersService } from 'src/products/services/offers/offers.service';

@ApiBearerAuth()
@ApiTags('Carts')
@Controller('cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private offerService: OffersService,
    private itemService: ItemsService,
  ) {}

  @HttpCode(200)
  @ApiOperation({ summary: 'Get the current Cart' })
  @ApiOkResponse({
    status: 200,
    type: Cart,
  })
  @Get()
  async getCurrentCart(@Req() req) {
    const user = req.user;

    let cart = await this.cartService.getByUserId(user);

    if (!cart) {
      await this.cartService.create(user);
      cart = await this.cartService.getByUserId(user);
    }

    return cart;
  }

  @HttpCode(201)
  @ApiOperation({ summary: 'Add items or offers to cart' })
  @ApiBody({ type: AddToCartDTO })
  @ApiOkResponse({
    status: 201,
    description: 'Product added to cart',
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.01,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_TYPE_FIELD',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.02,
    schema: {
      example: {
        statusCode: 400,
        message: 'TYPE_NOT_VALID',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.03,
    schema: {
      example: {
        statusCode: 400,
        message: 'PRODUCT_ID_MUST_BE_INTEGER',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.04,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_PRODUCT_ID_FIELD',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.05,
    schema: {
      example: {
        statusCode: 400,
        message: 'PRODUCT_QUANTITY_MUST_BE_INTEGER',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.06,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_PRODUCT_QUANTITY_FIELD.01',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.07,
    schema: {
      example: {
        statusCode: 400,
        message: 'MIN_QUANTITY: 1',
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
    description: 'The selected item does not exist',
    status: 404.01,
    schema: {
      example: {
        statusCode: 404,
        message: 'ITEM_NOT_FOUND',
      },
    },
  })
  @ApiResponse({
    description: 'The selected offer does not exist',
    status: 404.02,
    schema: {
      example: {
        statusCode: 404,
        message: 'OFFER_NOT_FOUND',
      },
    },
  })
  @Post()
  async addToCart(@Req() req, @Body() addToCartDTO: AddToCartDTO) {
    const user = req.user;
    let cart = await this.cartService.getByUserId(user);

    if (!cart) {
      await this.cartService.create(user);
      cart = await this.cartService.getByUserId(user);
    }

    if (addToCartDTO.type == CartProductType.Item) {
      const itemFound = await this.itemService.getOneItem(
        addToCartDTO.product_id,
      );

      if (!itemFound) {
        throw new HttpException('ITEM_NOT_FOUND', HttpStatus.NOT_FOUND);
      }

      let cartItemAlreadyExists: CartItem;
      let cartItemIndex: number;

      for (let index = 0; index < cart.cartItems.length; index++) {
        if (cart.cartItems[index].item.id == itemFound.id) {
          cartItemAlreadyExists = cart.cartItems[index];
          cartItemIndex = index;
        }
      }

      if (cartItemAlreadyExists) {
        cartItemAlreadyExists.quantity = addToCartDTO.quantity;
        cart.cartItems[cartItemIndex] = cartItemAlreadyExists;
      } else {
        const cartItem: CartItem = new CartItem();
        cartItem.item = itemFound;
        cartItem.quantity = addToCartDTO.quantity;
        cart.cartItems.push(cartItem);
      }
    } else if (addToCartDTO.type == CartProductType.Offer) {
      const offerFound = await this.offerService.getOne(
        addToCartDTO.product_id,
      );

      if (!offerFound) {
        throw new HttpException('OFFER_NOT_FOUND', HttpStatus.NOT_FOUND);
      }

      let cartOfferAlreadyExists: CartOffer;
      let cartOfferIndex: number;

      for (let index = 0; index < cart.cartOffers.length; index++) {
        if (cart.cartOffers[index].offer.id == offerFound.id) {
          cartOfferAlreadyExists = cart.cartOffers[index];
          cartOfferIndex = index;
        }
      }

      if (cartOfferAlreadyExists) {
        cartOfferAlreadyExists.quantity = addToCartDTO.quantity;
        cart.cartOffers[cartOfferIndex] = cartOfferAlreadyExists;
      } else {
        const cartOffer: CartOffer = new CartOffer();
        cartOffer.offer = offerFound;
        cartOffer.quantity = addToCartDTO.quantity;
        cart.cartOffers.push(cartOffer);
      }
    }

    await this.cartService.save(cart);
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Remove items or offers from cart' })
  @ApiBody({ type: RemoveFromCartDTO })
  @ApiOkResponse({
    status: 200,
    description: 'Product removed from cart',
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.01,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_TYPE_FIELD',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.02,
    schema: {
      example: {
        statusCode: 400,
        message: 'TYPE_NOT_VALID',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.03,
    schema: {
      example: {
        statusCode: 400,
        message: 'ITEM_OR_OFFER_ID_MUST_BE_INTEGER',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.04,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_ITEM_OR_OFFER_ID_FIELD',
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
    description: 'The selected item does not exist in cart',
    status: 404.01,
    schema: {
      example: {
        statusCode: 404,
        message: 'ITEM_NOT_FOUND_IN_CART',
      },
    },
  })
  @ApiResponse({
    description: 'The selected offer does not exist in cart',
    status: 404.02,
    schema: {
      example: {
        statusCode: 404,
        message: 'OFFER_NOT_FOUND_IN_CART',
      },
    },
  })
  @Delete()
  async removeFromCart(
    @Req() req,
    @Body() removeFromCartDTO: RemoveFromCartDTO,
  ) {
    const cart = await this.cartService.getByUserId(req.user);

    if (!cart) {
      throw new HttpException('ITEM_NOT_FOUND_IN_CART', HttpStatus.NOT_FOUND);
    }

    if (removeFromCartDTO.type == CartProductType.Item) {
      const itemFound = cart.cartItems.find(
        (cartItem) => cartItem.id == removeFromCartDTO.type_id,
      );

      const itemFoundIndex = cart.cartItems.findIndex(
        (cartItem) => cartItem.id == removeFromCartDTO.type_id,
      );

      if (!itemFound) {
        throw new HttpException('ITEM_NOT_FOUND_IN_CART', HttpStatus.NOT_FOUND);
      }

      delete cart.cartOffers[itemFoundIndex];

      await this.cartService.save(cart);
      await this.cartService.removeCartItem(itemFound);
    } else if (removeFromCartDTO.type == CartProductType.Offer) {
      const offerFound = cart.cartOffers.find(
        (cartOffer) => cartOffer.id == removeFromCartDTO.type_id,
      );

      const offerFoundIndex = cart.cartOffers.findIndex(
        (cartOffer) => cartOffer.id == removeFromCartDTO.type_id,
      );

      if (!offerFound) {
        throw new HttpException(
          'OFFER_NOT_FOUND_IN_CART',
          HttpStatus.NOT_FOUND,
        );
      }

      delete cart.cartOffers[offerFoundIndex];

      await this.cartService.save(cart);
      await this.cartService.removeCartOffer(offerFound);
    }
  }
}
