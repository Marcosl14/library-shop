import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
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

export class CreateOfferDTO {
  @ApiProperty({
    example: 'Lorem ipsum dolor sit amet, consectetuer adipiscin',
    description: 'Offer title',
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
    message: 'TITLE_MAX_LENGTH: 100',
  })
  title: string;

  @ApiProperty({
    example: 'Lorem ipsum dolor sit amet, consectetuer adipiscin',
    description: 'Offer Description',
    maxLength: 1000,
    type: String,
  })
  @IsOptional()
  @IsString({
    message: 'DESCRIPTION_MUST_BE_STRING',
  })
  @MaxLength(1000, {
    message: 'DESCRIPTION_MAX_LENGTH: 1000',
  })
  description?: string;

  @ApiProperty({
    example: 'www.mypicture.com/347378jhdf32974987342_2347832756',
    description: 'Offer Photo',
    maxLength: 1000,
    type: 'url',
  })
  @IsOptional()
  @IsUrl({ message: 'PHOTO_MUST_BE_A_URL_ADRESS' })
  @MaxLength(100, {
    message: 'PHOTO_MAX_LENGTH: 100',
  })
  photo?: string;

  @ApiProperty({
    nullable: false,
    example: 999.99,
    description: 'Offer Price',
    type: Number,
  })
  @IsNumber({}, { message: 'PRICE_MUST_BE_NUMBER' })
  @Min(0.01, { message: 'PRICE_VALUE_MUST_BE_HIGHER_THAN_0.01' })
  price: number;

  @ApiProperty({
    nullable: false,
    example: 25,
    description: 'Offer Discount',
    type: Number,
  })
  @IsOptional()
  @IsNumber({}, { message: 'DISCOUNT_MUST_BE_NUMBER' })
  @Min(0.01, { message: 'DISCOUNT_VALUE_MUST_BE_HIGHER_THAN_0' })
  @Max(100, { message: 'DISCOUNT_VALUE_MUST_BE_LOWER_THAN_100' })
  discount?: number;

  @ApiProperty({
    type: Number,
    description: "Offer Items Id's",
  })
  @IsArray({ message: 'ITEMS_MUST_BE_ARRAY' })
  @ArrayNotEmpty({ message: 'EMPTY_ITEMS_ARRAY' })
  @IsInt({ message: "ITEMS_ID'S_MUST_BE_INTEGERS", each: true })
  @IsNotEmpty({ message: 'EMPTY_ITEMS_FIELD' })
  items: number[];
}
