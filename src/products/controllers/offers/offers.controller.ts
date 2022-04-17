import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/role.enum';
import { OffersService } from 'src/products/services/offers/offers.service';

import { Offer } from 'src/products/models/offer.entity';
import { CreateOfferDTO } from 'src/products/models/create-offer.dto';
import { UpdateOfferDTO } from 'src/products/models/update-offer.dto';

@ApiBearerAuth()
@ApiTags('Product-Offers')
@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @HttpCode(200)
  @ApiOperation({ summary: 'Get all offers' })
  @ApiOkResponse({
    status: 200,
    type: Offer,
    isArray: true,
  })
  @Public()
  @Get()
  async getAllOffers() {
    return await this.offersService.getAll();
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Get an offer' })
  @ApiParam({
    name: 'id',
    type: Number,
    required: false,
    description: 'Offer Id',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Return the selected offer',
    type: Offer,
  })
  @ApiResponse({
    description: 'The offer id must be a number',
    status: 409.01,
    schema: {
      example: {
        statusCode: 409,
        message: 'ID_MUST_BE_NUMBER',
      },
    },
  })
  @Public()
  @Get(':id')
  async getOneOffer(@Param('id') id: number) {
    if (isNaN(id)) {
      throw new HttpException('ID_MUST_BE_NUMBER', HttpStatus.CONFLICT);
    }
    return this.offersService.getOne(id);
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Create an offer' })
  @ApiBody({ type: CreateOfferDTO })
  @ApiOkResponse({
    status: 200,
    description: 'Return the created offer id',
    schema: {
      example: {
        id: 1,
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.01,
    schema: {
      example: {
        statusCode: 400,
        message: 'TITLE_MUST_BE_STRING',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.02,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_TITLE_FIELD',
      },
    },
  })
  @ApiResponse({
    description: 'Title must contain less than 100 characters',
    status: 400.03,
    schema: {
      example: {
        statusCode: 400,
        message: 'TITLE_MAX_LENGTH: 100',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.04,
    schema: {
      example: {
        statusCode: 400,
        message: 'DESCRIPTION_MUST_BE_STRING',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.05,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_DESCRIPTION_FIELD',
      },
    },
  })
  @ApiResponse({
    description: 'Description must contain less than 1000 characters',
    status: 400.06,
    schema: {
      example: {
        statusCode: 400,
        message: 'DESCRIPTION_MAX_LENGTH: 1000',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.07,
    schema: {
      example: {
        statusCode: 400,
        message: 'PHOTO_MUST_BE_A_URL_ADRESS',
      },
    },
  })
  @ApiResponse({
    description: 'Photo url must contain less than 100 characters',
    status: 400.08,
    schema: {
      example: {
        statusCode: 400,
        message: 'PHOTO_MAX_LENGTH: 100',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.09,
    schema: {
      example: {
        statusCode: 400,
        message: 'PRICE_MUST_BE_NUMBER',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.1,
    schema: {
      example: {
        statusCode: 400,
        message: 'PRICE_VALUE_MUST_BE_HIGHER_THAN_0.01',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.11,
    schema: {
      example: {
        statusCode: 400,
        message: 'DISCOUNT_MUST_BE_NUMBER',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.12,
    schema: {
      example: {
        statusCode: 400,
        message: 'DISCOUNT_VALUE_MUST_BE_HIGHER_THAN_0',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.13,
    schema: {
      example: {
        statusCode: 400,
        message: 'DISCOUNT_VALUE_MUST_BE_LOWER_THAN_100',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.14,
    schema: {
      example: {
        statusCode: 400,
        message: 'ITEMS_MUST_BE_ARRAY',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.15,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_ITEMS_ARRAY',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.16,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_ITEMS_FIELD',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.17,
    schema: {
      example: {
        statusCode: 400,
        message: 'ITEM_ID_MUST_BE_INTEGER',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.18,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_ITEM_ID_FIELD',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.19,
    schema: {
      example: {
        statusCode: 400,
        message: 'ITEM_QUANTITY_MUST_BE_INTEGER',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.2,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_ITEM_QUANTITY_FIELD',
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
  @ApiResponse({
    description: 'The selected item does not exist',
    status: 404.01,
    schema: {
      example: {
        statusCode: 404,
        message: 'ITEM_ID_NOT_FOUND: ${id}',
      },
    },
  })
  @ApiResponse({
    description: 'There is already an offer with the same items',
    status: 409.01,
    schema: {
      example: {
        statusCode: 409,
        message: 'OFFER_ALREADY_EXISTS',
      },
    },
  })
  @Roles(Role.Admin)
  @Post()
  async createOffer(@Body() offerDTO: CreateOfferDTO) {
    const offerId = await this.offersService.create(offerDTO);
    return { id: offerId };
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Update an offer' })
  @ApiBody({ type: UpdateOfferDTO })
  @ApiParam({
    name: 'id',
    type: Number,
    required: false,
    description: 'Offer Id',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Return the updated offer id',
    schema: {
      example: {
        id: 1,
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.01,
    schema: {
      example: {
        statusCode: 400,
        message: 'TITLE_MUST_BE_STRING',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.02,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_TITLE_FIELD',
      },
    },
  })
  @ApiResponse({
    description: 'Title must contain less than 100 characters',
    status: 400.03,
    schema: {
      example: {
        statusCode: 400,
        message: 'TITLE_MAX_LENGTH: 100',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.04,
    schema: {
      example: {
        statusCode: 400,
        message: 'DESCRIPTION_MUST_BE_STRING',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.05,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_DESCRIPTION_FIELD',
      },
    },
  })
  @ApiResponse({
    description: 'Description must contain less than 1000 characters',
    status: 400.06,
    schema: {
      example: {
        statusCode: 400,
        message: 'DESCRIPTION_MAX_LENGTH: 1000',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.07,
    schema: {
      example: {
        statusCode: 400,
        message: 'PHOTO_MUST_BE_A_URL_ADRESS',
      },
    },
  })
  @ApiResponse({
    description: 'Photo url must contain less than 100 characters',
    status: 400.08,
    schema: {
      example: {
        statusCode: 400,
        message: 'PHOTO_MAX_LENGTH: 100',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.09,
    schema: {
      example: {
        statusCode: 400,
        message: 'PRICE_MUST_BE_NUMBER',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.1,
    schema: {
      example: {
        statusCode: 400,
        message: 'PRICE_VALUE_MUST_BE_HIGHER_THAN_0.01',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.11,
    schema: {
      example: {
        statusCode: 400,
        message: 'DISCOUNT_MUST_BE_NUMBER',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.12,
    schema: {
      example: {
        statusCode: 400,
        message: 'DISCOUNT_VALUE_MUST_BE_HIGHER_THAN_0',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.13,
    schema: {
      example: {
        statusCode: 400,
        message: 'DISCOUNT_VALUE_MUST_BE_LOWER_THAN_100',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.14,
    schema: {
      example: {
        statusCode: 400,
        message: 'ITEMS_MUST_BE_ARRAY',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.15,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_ITEMS_ARRAY',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.16,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_ITEMS_FIELD',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.17,
    schema: {
      example: {
        statusCode: 400,
        message: 'ITEM_ID_MUST_BE_INTEGER',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.18,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_ITEM_ID_FIELD',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.19,
    schema: {
      example: {
        statusCode: 400,
        message: 'ITEM_QUANTITY_MUST_BE_INTEGER',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.2,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_ITEM_QUANTITY_FIELD',
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
  @ApiResponse({
    description: 'The selected item does not exist',
    status: 404.01,
    schema: {
      example: {
        statusCode: 404,
        message: 'ITEM_ID_NOT_FOUND: ${id}',
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
  @ApiResponse({
    description: 'There is already an offer with the same items',
    status: 409.01,
    schema: {
      example: {
        statusCode: 409,
        message: 'OFFER_ALREADY_EXISTS',
      },
    },
  })
  @Roles(Role.Admin)
  @Patch(':id')
  async updateOffer(@Param('id') id, @Body() offerDTO: UpdateOfferDTO) {
    const offerId = await this.offersService.update(id, offerDTO);
    return { id: offerId };
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Delete an offer' })
  @ApiParam({
    name: 'id',
    type: Number,
    required: false,
    description: 'Offer Id',
  })
  @ApiOkResponse({
    status: 200,
  })
  @ApiResponse({
    description: 'The selected offer does not exist',
    status: 404.01,
    schema: {
      example: {
        statusCode: 404,
        message: 'OFFER_NOT_FOUND',
      },
    },
  })
  @ApiResponse({
    description: 'The offer id must be a number',
    status: 409.01,
    schema: {
      example: {
        statusCode: 409,
        message: 'ID_MUST_BE_NUMBER',
      },
    },
  })
  @Roles(Role.Admin)
  @Delete(':id')
  async deleteOffer(@Param('id') id: number) {
    if (isNaN(id)) {
      throw new HttpException('ID_MUST_BE_NUMBER', HttpStatus.CONFLICT);
    }
    await this.offersService.delete(id);
  }
}
