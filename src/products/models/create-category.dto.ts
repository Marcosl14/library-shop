import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateCategoryDTO {
  @ApiProperty({
    example: 'Shoes',
    description: 'Category name',
    nullable: false,
    required: true,
    maxLength: 100,
    type: String,
  })
  @IsString({
    message: 'NAME_MUST_BE_STRING',
  })
  @IsNotEmpty({
    message: 'EMPTY_NAME_FIELD',
  })
  @MaxLength(30, {
    message: 'NAME_MAX_LENGTH: 30',
  })
  name: string;

  @ApiProperty({
    example: 'www.mypicture.com/347378jhdf32974987342_2347832756',
    description: 'Category Icon',
    maxLength: 1000,
    type: 'url',
    required: true,
    nullable: false,
  })
  @IsUrl({ message: 'ICON_MUST_BE_A_URL_ADRESS' })
  @MaxLength(1000, {
    message: 'ICON_MAX_LENGTH: 1000',
  })
  icon: string;
}
