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
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { ItemsService } from 'src/products/services/items/items.service';

import { DirectionENUM } from 'src/products/models/direction.enum';
import { OrderByEnum } from 'src/products/models/order-by.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/role.enum';
import { CreateItemDTO } from 'src/products/models/create-item.dto';
import { GetItemsQuery } from 'src/products/models/get-items.query';

@ApiBearerAuth()
@ApiTags('Products')
@Controller('items')
export class ItemsController {
  constructor(private itemsService: ItemsService) {}
  @HttpCode(200)
  @ApiOperation({ summary: 'Product items pagination' })
  @ApiQuery({
    name: 'categoryId',
    type: Number,
    required: false,
    description: 'Category Id',
  })
  @ApiQuery({
    name: 'orderBy',
    enum: OrderByEnum,
    required: false,
    description: 'Ordering by keyword',
  })
  @ApiQuery({
    name: 'dir',
    enum: DirectionENUM,
    required: false,
    description: 'Ordering direction',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
  })
  @ApiOkResponse({
    status: 200,
  })
  @Public()
  @Get()
  async getAllItems(@Query() getItemsQuery: GetItemsQuery) {
    const limit = 24;

    console.log(getItemsQuery);

    const itemsPaginated = await this.itemsService.getItems(
      {
        categoryId: getItemsQuery.categoryId,
        orderBy: getItemsQuery.orderBy,
        direction: getItemsQuery.dir,
      },
      {
        limit,
        page: getItemsQuery.page,
      },
    );

    // // en caso de querer eliminar el item.category, hacemos...
    // // itemsPaginated.items.map((item) => delete item.category);

    return itemsPaginated;
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Get a product item' })
  @ApiParam({
    name: 'id',
    type: Number,
    required: false,
    description: 'Item Id',
  })
  @ApiOkResponse({
    status: 200,
  })
  @ApiResponse({
    description: 'The item id must be a number',
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
  async getOneItem(@Param('id') id: number) {
    if (isNaN(id)) {
      throw new HttpException('ID_MUST_BE_NUMBER', HttpStatus.CONFLICT);
    }
    return this.itemsService.getOneItem(id);
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Create a product item' })
  @ApiBody({ type: CreateItemDTO })
  @ApiOkResponse({
    status: 200,
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
    description: 'The provided value is not valid',
    status: 400.03,
    schema: {
      example: {
        statusCode: 400,
        message: 'DESCRIPTION_MUST_BE_STRING',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.04,
    schema: {
      example: {
        statusCode: 400,
        message: 'PHOTO_MUST_BE_A_URL_ADRESS',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.05,
    schema: {
      example: {
        statusCode: 400,
        message: 'PRICE_MUST_BE_NUMBER',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.06,
    schema: {
      example: {
        statusCode: 400,
        message: 'PRICE_VALUE_MUST_BE_HIGHER_THAN_0.01',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.07,
    schema: {
      example: {
        statusCode: 400,
        message: 'DISCOUNT_MUST_BE_NUMBER',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.08,
    schema: {
      example: {
        statusCode: 400,
        message: 'DISCOUNT_VALUE_MUST_BE_HIGHER_THAN_0',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.09,
    schema: {
      example: {
        statusCode: 400,
        message: 'DISCOUNT_VALUE_MUST_BE_LOWER_THAN_100',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.1,
    schema: {
      example: {
        statusCode: 400,
        message: 'BRAND_MUST_BE_STRING',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.11,
    schema: {
      example: {
        statusCode: 400,
        message: 'CATEGORY_ID_MUST_BE_INTEGER',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.12,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_CATEGORY_FIELD',
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
    description: 'The selected category does not exist',
    status: 404.01,
    schema: {
      example: {
        statusCode: 404,
        message: 'CATEGORY_NOT_FOUND',
      },
    },
  })
  @Roles(Role.Admin)
  @Post()
  async createItem(@Body() newItem: CreateItemDTO) {
    // console.log() ver si valido que el producto ya exista, o no.....
    await this.itemsService.create(newItem);
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Update a product item' })
  @ApiBody({ type: CreateItemDTO })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'Item Id',
  })
  @ApiOkResponse({
    status: 200,
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
    description: 'The provided value is not valid',
    status: 400.03,
    schema: {
      example: {
        statusCode: 400,
        message: 'DESCRIPTION_MUST_BE_STRING',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.04,
    schema: {
      example: {
        statusCode: 400,
        message: 'PHOTO_MUST_BE_A_URL_ADRESS',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.05,
    schema: {
      example: {
        statusCode: 400,
        message: 'PRICE_MUST_BE_NUMBER',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.06,
    schema: {
      example: {
        statusCode: 400,
        message: 'PRICE_VALUE_MUST_BE_HIGHER_THAN_0.01',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.07,
    schema: {
      example: {
        statusCode: 400,
        message: 'DISCOUNT_MUST_BE_NUMBER',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.08,
    schema: {
      example: {
        statusCode: 400,
        message: 'DISCOUNT_VALUE_MUST_BE_HIGHER_THAN_0',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.09,
    schema: {
      example: {
        statusCode: 400,
        message: 'DISCOUNT_VALUE_MUST_BE_LOWER_THAN_100',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.1,
    schema: {
      example: {
        statusCode: 400,
        message: 'BRAND_MUST_BE_STRING',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.11,
    schema: {
      example: {
        statusCode: 400,
        message: 'CATEGORY_ID_MUST_BE_INTEGER',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.12,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_CATEGORY_FIELD',
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
        message: 'ITEM_NOT_FOUND',
      },
    },
  })
  @ApiResponse({
    description: 'The selected category does not exist',
    status: 404.02,
    schema: {
      example: {
        statusCode: 404,
        message: 'CATEGORY_NOT_FOUND',
      },
    },
  })
  @ApiResponse({
    description: 'The item id must be a number',
    status: 409.01,
    schema: {
      example: {
        statusCode: 409,
        message: 'ID_MUST_BE_NUMBER',
      },
    },
  })
  @Roles(Role.Admin)
  @Patch(':id')
  async updateItem(@Param('id') id: number, @Body() newItem: CreateItemDTO) {
    if (isNaN(id)) {
      throw new HttpException('ID_MUST_BE_NUMBER', HttpStatus.NOT_FOUND);
    }
    await this.itemsService.update(id, newItem);
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a product item' })
  @ApiParam({
    name: 'id',
    type: Number,
    required: false,
    description: 'Item Id',
  })
  @ApiOkResponse({
    status: 200,
  })
  @ApiResponse({
    description: 'The item id must be a number',
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
  async deleteItem(@Param('id') id: number) {
    if (isNaN(id)) {
      throw new HttpException('ID_MUST_BE_NUMBER', HttpStatus.NOT_FOUND);
    }
    await this.itemsService.delete(id);
  }
}
