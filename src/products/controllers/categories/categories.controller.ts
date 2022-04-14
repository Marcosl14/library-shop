import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger/dist';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/role.enum';
import { CategoriesService } from 'src/products/services/categories/categories.service';

import { CreateCategoryDTO } from 'src/products/models/create-category.dto';

@ApiBearerAuth()
@ApiTags('Product-Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Public()
  @Get()
  async getAllItems() {
    return await this.categoriesService.getCategories();
  }

  @Roles(Role.Admin)
  @Post()
  async createItem(@Body() categoryDto: CreateCategoryDTO) {
    await this.categoriesService.createCategory(categoryDto);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async updateItem(
    @Param('id') id: number,
    @Body() categoryDto: CreateCategoryDTO,
  ) {
    if (isNaN(id)) {
      throw new HttpException('ID_MUST_BE_NUMBER', HttpStatus.NOT_FOUND);
    }

    await this.categoriesService.updateCategory(id, categoryDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async deleteItem(@Param('id') id: number) {
    if (isNaN(id)) {
      throw new HttpException('ID_MUST_BE_NUMBER', HttpStatus.NOT_FOUND);
    }

    await this.categoriesService.deleteCategory(id);
  }
}
