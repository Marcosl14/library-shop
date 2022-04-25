import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';
import { CartProductType } from './type.enum';

export class AddToCartDTO {
  @ApiProperty({
    description: 'Cart Product Type',
    nullable: false,
    enum: CartProductType,
  })
  @IsNotEmpty({
    message: 'EMPTY_TYPE_FIELD',
  })
  @IsEnum(CartProductType, { message: 'TYPE_NOT_VALID' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : '',
  )
  type: CartProductType;

  @ApiProperty({
    type: Number,
    description: 'Product Id',
  })
  @IsInt({ message: 'PRODUCT_ID_MUST_BE_INTEGER' })
  @IsNotEmpty({
    message: 'EMPTY_PRODUCT_ID_FIELD',
  })
  product_id: number;

  @ApiProperty({
    type: Number,
    description: 'Product quatity',
  })
  @IsInt({ message: 'PRODUCT_QUANTITY_MUST_BE_INTEGER' })
  @IsNotEmpty({
    message: 'EMPTY_PRODUCT_QUANTITY_FIELD',
  })
  @Min(1, { message: 'MIN_QUANTITY: 1' })
  quantity: number;
}
