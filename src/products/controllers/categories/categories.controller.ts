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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger/dist';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/role.enum';
import { CategoriesService } from 'src/products/services/categories/categories.service';

import { CreateCategoryDTO } from 'src/products/models/create-category.dto';
import { Category } from 'src/products/models/categories.entity';
import { UpdateCategoryDTO } from 'src/products/models/update-category.dto';

@ApiBearerAuth()
@ApiTags('Product-Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @HttpCode(200)
  @ApiOperation({ summary: 'Product categories' })
  @ApiOkResponse({
    status: 200,
    type: Category,
    isArray: true,
  })
  @Public()
  @Get()
  async getAllCategories() {
    return await this.categoriesService.getCategories();
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Create a product category' })
  @ApiBody({ type: CreateCategoryDTO })
  @ApiOkResponse({ status: 200 })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.01,
    schema: {
      example: {
        statusCode: 400,
        message: 'NAME_MUST_BE_STRING',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.02,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_NAME_FIELD',
      },
    },
  })
  @ApiResponse({
    description: 'The name must contain less than 30 characters',
    status: 400.03,
    schema: {
      example: {
        statusCode: 400,
        message: 'NAME_MAX_LENGTH: 100',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.04,
    schema: {
      example: {
        statusCode: 400,
        message: 'ICON_MUST_BE_A_URL_ADRESS',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.05,
    schema: {
      example: {
        statusCode: 400,
        message: 'ICON_MAX_LENGTH: 1000',
      },
    },
  })
  @Roles(Role.Admin)
  @Post()
  async createCategory(@Body() categoryDto: CreateCategoryDTO) {
    await this.categoriesService.createCategory(categoryDto);
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Update a product category' })
  @ApiBody({ type: UpdateCategoryDTO })
  @ApiOkResponse({ status: 200 })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.01,
    schema: {
      example: {
        statusCode: 400,
        message: 'NAME_MUST_BE_STRING',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.02,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_NAME_FIELD',
      },
    },
  })
  @ApiResponse({
    description: 'The name must contain less than 30 characters',
    status: 400.03,
    schema: {
      example: {
        statusCode: 400,
        message: 'NAME_MAX_LENGTH: 100',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.04,
    schema: {
      example: {
        statusCode: 400,
        message: 'ICON_MUST_BE_A_URL_ADRESS',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.05,
    schema: {
      example: {
        statusCode: 400,
        message: 'ICON_MAX_LENGTH: 1000',
      },
    },
  })
  @ApiResponse({
    description: 'The provided category Id was not found',
    status: 404.01,
    schema: {
      example: {
        statusCode: 404,
        message: 'CATEGORY_NOT_FOUND',
      },
    },
  })
  @ApiResponse({
    description: 'The provided category Id is not a number',
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
  async updateCategory(
    @Param('id') id: number,
    @Body() categoryDto: UpdateCategoryDTO,
  ) {
    if (isNaN(id)) {
      throw new HttpException('ID_MUST_BE_NUMBER', HttpStatus.CONFLICT);
    }

    await this.categoriesService.updateCategory(id, categoryDto);
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a product category' })
  @ApiOkResponse({
    status: 200,
    description: 'Category removed',
  })
  @ApiResponse({
    description: 'The provided category Id was not found',
    status: 404.01,
    schema: {
      example: {
        statusCode: 404,
        message: 'CATEGORY_NOT_FOUND',
      },
    },
  })
  @ApiResponse({
    description: 'The provided category Id is not a number',
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
  async deleteCategory(@Param('id') id: number) {
    if (isNaN(id)) {
      throw new HttpException('ID_MUST_BE_NUMBER', HttpStatus.CONFLICT);
    }

    await this.categoriesService.deleteCategory(id);
  }
}
