import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { ItemSearchOptions } from 'src/products/models/item-search-options.interface';
import { Item } from 'src/products/models/item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ItemsService {
  constructor(@InjectRepository(Item) private itemsRepo: Repository<Item>) {}

  async getItems(
    searchOptions: ItemSearchOptions,
    paginationOptions: IPaginationOptions,
  ): Promise<Pagination<Item>> {
    const query = this.itemsRepo.createQueryBuilder('items');
    query.leftJoinAndSelect('items.category', 'category');

    if (searchOptions.categoryId) {
      query.where('category.id = :categoryId', {
        categoryId: searchOptions.categoryId,
      });
    }

    if (searchOptions.orderBy) {
      query.orderBy(searchOptions.orderBy, searchOptions.dir);
    }

    return paginate(query, paginationOptions);
  }
}
