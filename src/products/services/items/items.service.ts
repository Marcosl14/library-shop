import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Category } from 'src/products/models/categories.entity';
import { CreateItemDTO } from 'src/products/models/create-item.dto';
import { ItemSearchOptions } from 'src/products/models/item-search-options.interface';
import { Item } from 'src/products/models/item.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private itemsRepo: Repository<Item>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  async getItems(
    searchOptions: ItemSearchOptions,
    paginationOptions: IPaginationOptions,
  ): Promise<Pagination<Item>> {
    const query = this.itemsRepo.createQueryBuilder('items');
    query.leftJoinAndSelect('items.category', 'category');

    query.where({ deletedAt: IsNull() });

    if (searchOptions.categoryId) {
      query.andWhere('category.id = :categoryId', {
        categoryId: searchOptions.categoryId,
      });
    }

    if (searchOptions.orderBy) {
      query.orderBy(searchOptions.orderBy, searchOptions.direction);
    }

    return paginate(query, paginationOptions);
  }

  async create(itemDto: CreateItemDTO) {
    const category = await this.categoryRepo.findOne(itemDto.categoryId);

    if (!category) {
      throw new HttpException('CATEGORY_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const newItem = await this.itemsRepo.create(itemDto);

    newItem.category = category;

    await this.itemsRepo.save(newItem);
  }
}
