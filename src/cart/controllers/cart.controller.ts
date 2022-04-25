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
  ApiTags,
} from '@nestjs/swagger';
import { Item } from 'src/products/models/item.entity';
import { ItemsService } from 'src/products/services/items/items.service';
import { OffersService } from 'src/products/services/offers/offers.service';
import { UserRegistrationDTO } from 'src/users/models/user-registration.dto';
import { AddToCartDTO } from '../models/add-to-cart.dto';
import { CartItem } from '../models/cart-item.entity';
import { CartOffer } from '../models/cart-offer.entity';
import { Cart } from '../models/cart.entity';
import { RemoveFromCartDTO } from '../models/remove-from-cart.dto';
import { CartProductType } from '../models/type.enum';
import { CartService } from '../services/cart.service';

@ApiBearerAuth()
@ApiTags('Carts')
@Controller('cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private offerService_: OffersService,
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
    return await this.cartService.getByUserId(req.user);
  }

  @HttpCode(201)
  @ApiOperation({ summary: 'Add to cart' })
  @ApiBody({ type: AddToCartDTO })
  @ApiOkResponse({
    status: 201,
    description: 'Product added to cart',
  })
  @Post()
  async addToCart(@Req() req, @Body() addToCartDTO: AddToCartDTO) {
    const cart = await this.cartService.getByUserId(req.user);

    // agregar el item o la oferta al carrito
    // hacer .save para guardar el carrito

    // item y offer seran un ENUM
    if (addToCartDTO.type == CartProductType.Item) {
      const itemFound = await this.itemService.getOneItem(
        addToCartDTO.product_id,
      );

      if (!itemFound) {
        throw new HttpException('ITEM_NOT_FOUND', HttpStatus.NOT_FOUND);
      }

      //console.log() Ojo porque hay algo raro con la creacion del item

      let cartItemAlreadyExists: CartItem;
      let cartItemIndex: number;

      for (let index = 0; index < cart.cartItems.length; index++) {
        if (cart.cartItems[index].id == itemFound.id) {
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
      const offerFound = await this.offerService_.getOne(
        addToCartDTO.product_id,
      );

      if (!offerFound) {
        throw new HttpException('OFFER_NOT_FOUND', HttpStatus.NOT_FOUND);
      }

      //console.log() Ojo porque hay algo raro con la creacion de la offer

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

    await this.cartService.addToCart(cart);
  }

  @Delete()
  async removeFromCart(
    @Req() req,
    @Body() removeFromCartDTO: RemoveFromCartDTO,
  ) {
    const cart = await this.cartService.getByUserId(req.user);

    // agregar el item o la oferta al carrito
    // hacer .save para guardar el carrito

    // item y offer seran un ENUM
    if (removeFromCartDTO.type == CartProductType.Item) {
      const itemFound = await this.itemService.getOneItem(
        removeFromCartDTO.product_id,
      );

      if (!itemFound) {
        throw new HttpException('ITEM_NOT_FOUND', HttpStatus.NOT_FOUND);
      }

      let cartItemAlreadyExists: CartItem;
      let cartItemIndex: number;

      for (let index = 0; index < cart.cartItems.length; index++) {
        if (cart.cartItems[index].id == itemFound.id) {
          cartItemAlreadyExists = cart.cartItems[index];
          cartItemIndex = index;
        }
      }

      if (cartItemAlreadyExists) {
        delete cart.cartItems[cartItemIndex];

        //console.log() éste delete es medio ordinario, porque no borra realmente el cartItem de la BD...
        //quizas en éste caso abrìa que eliminar el elemento de la BD...
      } else {
        throw new HttpException('ITEM_NOT_FOUND', HttpStatus.NOT_FOUND);
      }
    } else if (removeFromCartDTO.type == CartProductType.Offer) {
      const offerFound = await this.offerService_.getOne(
        removeFromCartDTO.product_id,
      );

      if (!offerFound) {
        throw new HttpException(
          'OFFER_NOT_FOUND_IN_CART',
          HttpStatus.NOT_FOUND,
        );
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
        delete cart.cartOffers[cartOfferIndex];

        //console.log() éste delete es medio ordinario, porque no borra realmente el cartItem de la BD...
        //quizas en éste caso abrìa que eliminar el elemento de la BD...
      } else {
        throw new HttpException(
          'OFFER_NOT_FOUND_IN_CART',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    await this.cartService.addToCart(cart);
  }
}
