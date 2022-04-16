import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/products/models/categories.entity';
import { CreateCategoryDTO } from 'src/products/models/create-category.dto';
import { UpdateCategoryDTO } from 'src/products/models/update-category.dto';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  async getCategories(): Promise<Category[]> {
    return await this.categoryRepo.find();
  }

  async createCategory(categoryDto: CreateCategoryDTO): Promise<void> {
    const newItem = await this.categoryRepo.create(categoryDto);

    await this.categoryRepo.save(newItem);
  }

  async updateCategory(
    id: number,
    categoryDto: UpdateCategoryDTO,
  ): Promise<void> {
    const category = await this.categoryRepo.findOne(id);

    if (!category) {
      throw new HttpException('CATEGORY_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    await this.categoryRepo.update(id, categoryDto);
  }

  async deleteCategory(id: number) {
    const category = await this.categoryRepo.findOne(id);

    if (!category) {
      throw new HttpException('CATEGORY_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    await this.categoryRepo.softDelete(id);
  }
}
