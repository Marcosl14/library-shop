import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { CartProductType } from './type.enum';

export class RemoveFromCartDTO {
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
}
