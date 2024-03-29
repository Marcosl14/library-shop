import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { DirectionENUM } from './direction.enum';
import { OrderByEnum } from './order-by.enum';

export class GetItemsQueryDTO {
  @IsInt({ message: 'CATEGORY_ID_MUST_BE_INTEGER' })
  @IsOptional()
  @Type(() => Number)
  categoryId: null;

  @IsEnum(OrderByEnum, { message: 'ORDER_BY_NOT_VALID' })
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  orderBy: OrderByEnum.EMPTY;

  @IsEnum(DirectionENUM, { message: 'DIRECTION_NOT_VALID' })
  @IsOptional()
  @Transform(({ value }) => value.toUpperCase())
  dir: DirectionENUM.ASC;

  @IsInt({ message: 'PAGE_MUST_BE_INTEGER' })
  @IsOptional()
  @Type(() => Number)
  page = 1;

  @IsString({ message: 'SEARCH_PRODUCT_MUST_BE_STRING' })
  @IsOptional()
  @Type(() => String)
  searchProductString = '';
}
