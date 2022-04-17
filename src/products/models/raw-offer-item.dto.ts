import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class RawOfferItem {
  @ApiProperty({
    type: Number,
    description: 'Item Id',
  })
  @IsInt({ message: 'ITEM_ID_MUST_BE_INTEGER' })
  @IsNotEmpty({
    message: 'EMPTY_ITEM_ID_FIELD',
  })
  id: number;

  @ApiProperty({
    type: Number,
    description: 'Item quatity',
  })
  @IsInt({ message: 'ITEM_QUANTITY_MUST_BE_INTEGER' })
  @IsNotEmpty({
    message: 'EMPTY_ITEM_QUANTITY_FIELD',
  })
  quantity: number;
}
