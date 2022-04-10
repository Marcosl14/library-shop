import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { Public } from 'src/auth/decorators/public.decorator';
import { ItemsService } from 'src/products/services/items/items.service';

import { Item } from 'src/products/models/item.entity';
import { DirectionENUM } from 'src/products/models/direction.enum';
import { OrderByEnum } from 'src/products/models/order-by.enum';

@ApiBearerAuth()
@ApiTags('Products')
@Controller('items')
export class ItemsController {
  constructor(private itemsService: ItemsService) {}
  @HttpCode(200)
  @ApiOperation({ summary: 'Product items pagination' })
  @ApiOkResponse({
    status: 200,
  })
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
  @ApiResponse({
    description:
      'Validation failed (numeric string is expected) on categoryId and/or page',
    status: 400.01,
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
      },
    },
  })
  @Public()
  @Get()
  async getAllItems(
    @Query('categoryId', new DefaultValuePipe(null), ParseIntPipe)
    categoryId?: number,
    @Query('orderBy') ord?: string,
    @Query('dir') dir?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
  ): Promise<Pagination<Item, IPaginationMeta>> {
    let direction = DirectionENUM.ASC;
    if (Object.keys(DirectionENUM).includes(dir.trim().toUpperCase())) {
      direction = DirectionENUM[dir.trim().toUpperCase()];
    }

    let orderBy = OrderByEnum.EMPTY;
    if (Object.keys(OrderByEnum).includes(ord.trim().toUpperCase())) {
      orderBy = OrderByEnum[ord.trim().toUpperCase()];
    }

    page = page && page > 0 ? page : 1;
    const limit = 24;

    const itemsPaginated = await this.itemsService.getItems(
      {
        categoryId,
        orderBy,
        direction,
      },
      {
        limit,
        page,
      },
    );

    // en caso de querer eliminar el item.category, hacemos...
    // itemsPaginated.items.map((item) => delete item.category);

    return itemsPaginated;
  }
}
