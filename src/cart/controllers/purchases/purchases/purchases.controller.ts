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
import { ApiOperation, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/role.enum';
import { Cart } from 'src/cart/models/cart.entity';
import { GetPurchasesAsAdminDTO } from 'src/cart/models/get-purchases-as-admin-query.dto';
import { CartService } from 'src/cart/services/cart/cart.service';

@Controller('purchases')
export class PurchasesController {
  constructor(
    private cartService: CartService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Roles(Role.Admin)
  @Get('admin')
  async getAllPurchasesAsAdmin(
    @Query() getPurchasesAsAdminQueryDto: GetPurchasesAsAdminDTO,
  ) {
    return await this.cartService.getAllPurchasedCarts(
      getPurchasesAsAdminQueryDto,
    );
  }

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

    if (cart.cartItems.length === 0 && cart.cartOffers.length === 0) {
      throw new HttpException('EMPTY_CART', HttpStatus.CONFLICT);
    }

    cart.purchasedAt = new Date();
    await this.cartService.save(cart);
    await this.cartService.create(user);

    this.eventEmitter.emit('purchase.created', user, cart);
  }
}
