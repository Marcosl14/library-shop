import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { Public } from 'src/auth/decorators/public.decorator';
import { Item } from 'src/products/models/item.entity';
import { ItemsService } from 'src/products/services/items/items.service';

@ApiBearerAuth()
@ApiTags('Products')
@Controller('items')
export class ItemsController {
  constructor(private itemsService: ItemsService) {}

  @Public()
  @Get()
  async getAllItems(
    @Query('categoryId', new DefaultValuePipe(null)) categoryId?: number,
    @Query('orderBy') orderBy?: string,
    @Query('dir', new DefaultValuePipe('ASC')) dir: 'ASC' | 'DESC' = 'ASC',
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(24), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Item, IPaginationMeta>> {
    page = page >= 1 ? page : 1;
    limit = limit <= 100 ? limit : 100;

    return this.itemsService.getItems(
      {
        categoryId,
        orderBy,
        dir,
      },
      {
        limit,
        page,
      },
    );
  }
}
