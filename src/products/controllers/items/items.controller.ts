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
import { GetItemsQueryDTO } from 'src/products/models/get-items-query.dto';
import { UpdateItemDTO } from 'src/products/models/update-item.dto';

@ApiBearerAuth()
@ApiTags('Product-Items')
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
    description: 'Return a list of paginated items',
    schema: {
      example: {
        items: [
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
        meta: {
          totalItems: 2,
          itemCount: 2,
          itemsPerPage: 2,
          totalPages: 1,
          currentPage: 1,
        },
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.01,
    schema: {
      example: {
        statusCode: 400,
        message: 'CATEGORY_ID_MUST_BE_INTEGER',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.02,
    schema: {
      example: {
        statusCode: 400,
        message: 'ORDER_BY_NOT_VALID',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.03,
    schema: {
      example: {
        statusCode: 400,
        message: 'DIRECTION_NOT_VALID',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.04,
    schema: {
      example: {
        statusCode: 400,
        message: 'PAGE_MUST_BE_INTEGER',
      },
    },
  })
  @Public()
  @Get()
  async getAllItems(@Query() getItemsQuery: GetItemsQueryDTO) {
    const limit = 24;

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

    // en caso de querer eliminar el item.category, hacemos...
    // itemsPaginated.items.map((item) => delete item.category);

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
    description: 'Return the selected item',
    schema: {
      example: {
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
    description: 'Return the created item id',
    schema: {
      example: {
        id: 2,
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
    description: 'Title must contain less than 100 characters',
    status: 400.13,
    schema: {
      example: {
        statusCode: 400,
        message: 'TITLE_MAX_LENGTH: 100',
      },
    },
  })
  @ApiResponse({
    description: 'Description must contain less than 1000 characters',
    status: 400.14,
    schema: {
      example: {
        statusCode: 400,
        message: 'DESCRIPTION_MAX_LENGTH: 1000',
      },
    },
  })
  @ApiResponse({
    description: 'Photo url must contain less than 100 characters',
    status: 400.15,
    schema: {
      example: {
        statusCode: 400,
        message: 'PHOTO_MAX_LENGTH: 100',
      },
    },
  })
  @ApiResponse({
    description: 'Brand name must contain less than 30 characters',
    status: 400.16,
    schema: {
      example: {
        statusCode: 400,
        message: 'BRAND_MAX_LENGTH: 30',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.17,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_DESCRITPION_FIELD',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.18,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_BRAND_FIELD',
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
  async createItem(@Body() itemDto: CreateItemDTO) {
    // console.log() ver si valido que el producto ya exista, o no.....
    return { id: await this.itemsService.create(itemDto) };
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Update a product item' })
  @ApiBody({ type: UpdateItemDTO })
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
    description: 'The provided value is not valid',
    status: 400.13,
    schema: {
      example: {
        statusCode: 400,
        message: 'TITLE_MAX_LENGTH: 100',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.14,
    schema: {
      example: {
        statusCode: 400,
        message: 'DESCRIPTION_MAX_LENGTH: 1000',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.15,
    schema: {
      example: {
        statusCode: 400,
        message: 'PHOTO_MAX_LENGTH: 100',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.16,
    schema: {
      example: {
        statusCode: 400,
        message: 'BRAND_MAX_LENGTH: 30',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.17,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_DESCRITPION_FIELD',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.18,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_BRAND_FIELD',
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
  async updateItem(@Param('id') id: number, @Body() itemDto: UpdateItemDTO) {
    if (isNaN(id)) {
      throw new HttpException('ID_MUST_BE_NUMBER', HttpStatus.CONFLICT);
    }
    await this.itemsService.update(id, itemDto);
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
      throw new HttpException('ID_MUST_BE_NUMBER', HttpStatus.CONFLICT);
    }
    await this.itemsService.delete(id);
  }
}
