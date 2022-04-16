import { Controller, Get, HttpCode } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { Offer } from 'src/products/models/offer.entity';
import { OffersService } from 'src/products/services/offers/offers.service';

@ApiBearerAuth()
@ApiTags('Product-Offers')
@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @HttpCode(200)
  @ApiOperation({ summary: 'Product offers' })
  @ApiOkResponse({
    status: 200,
    type: Offer,
    isArray: true,
  })
  @Public()
  @Get()
  async getAllItems() {
    return await this.offersService.getOffers();
  }
}
