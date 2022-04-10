import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateItemDTO {
  @ApiProperty({
    example: 'Lorem ipsum dolor sit amet, consectetuer adipiscin',
    description: 'Item title',
    nullable: false,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Lorem ipsum dolor sit amet, consectetuer adipiscin',
    description: 'Item Description',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'www.mypicture.com/347378jhdf32974987342_2347832756',
    description: 'Item Photo',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiProperty({
    nullable: false,
    example: 999.99,
    description: 'Item Price',
    type: Number,
  })
  @IsNumber()
  @Min(0.01)
  price: number;

  @ApiProperty({
    nullable: false,
    example: 25,
    description: 'Item Discount',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discount?: number;

  @ApiProperty({
    type: 'string',
    example: 'Pizzini',
    description: 'Brand of item',
  })
  @IsOptional()
  brand?: string;

  @ApiProperty({
    type: 'number',
    description: 'Item Category Id',
  })
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
}
