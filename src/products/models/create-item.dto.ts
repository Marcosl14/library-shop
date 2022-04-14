import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { BeforeInsert } from 'typeorm';

export class CreateItemDTO {
  @ApiProperty({
    example: 'Lorem ipsum dolor sit amet, consectetuer adipiscin',
    description: 'Item title',
    nullable: false,
    maxLength: 100,
    type: String,
  })
  @IsString({
    message: 'TITLE_MUST_BE_STRING',
  })
  @IsNotEmpty({
    message: 'EMPTY_TITLE_FIELD',
  })
  @MaxLength(100, {
    message: 'TITLE_MAX_LENGTH',
  })
  title: string;

  @ApiProperty({
    example: 'Lorem ipsum dolor sit amet, consectetuer adipiscin',
    description: 'Item Description',
    maxLength: 1000,
    type: String,
  })
  @IsOptional()
  @IsString({
    message: 'DESCRIPTION_MUST_BE_STRING',
  })
  @MaxLength(1000, {
    message: 'DESCRIPTION_MAX_LENGTH',
  })
  description?: string;

  @ApiProperty({
    example: 'www.mypicture.com/347378jhdf32974987342_2347832756',
    description: 'Item Photo',
    maxLength: 1000,
    type: 'url',
  })
  @IsOptional()
  @IsUrl({ message: 'PHOTO_MUST_BE_A_URL_ADRESS' })
  @MaxLength(100, {
    message: 'PHOTO_MAX_LENGTH',
  })
  photo?: string;

  @ApiProperty({
    nullable: false,
    example: 999.99,
    description: 'Item Price',
    type: Number,
  })
  @IsNumber({}, { message: 'PRICE_MUST_BE_NUMBER' })
  @Min(0.01, { message: 'PRICE_VALUE_MUST_BE_HIGHER_THAN_0.01' })
  price: number;

  @ApiProperty({
    nullable: false,
    example: 25,
    description: 'Item Discount',
    type: Number,
  })
  @IsOptional()
  @IsNumber({}, { message: 'DISCOUNT_MUST_BE_NUMBER' })
  @Min(0.01, { message: 'DISCOUNT_VALUE_MUST_BE_HIGHER_THAN_0' })
  @Max(100, { message: 'DISCOUNT_VALUE_MUST_BE_LOWER_THAN_100' })
  discount?: number;

  @ApiProperty({
    type: String,
    example: 'Pizzini',
    description: 'Brand of item',
  })
  @IsOptional()
  @IsString({
    message: 'BRAND_MUST_BE_STRING',
  })
  @MaxLength(30, {
    message: 'BRAND_MAX_LENGTH',
  })
  brand?: string;

  @ApiProperty({
    type: Number,
    description: 'Item Category Id',
  })
  @IsInt({ message: 'CATEGORY_ID_MUST_BE_INTEGER' })
  @IsNotEmpty({
    message: 'EMPTY_CATEGORY_FIELD',
  })
  category_id: number;
}
