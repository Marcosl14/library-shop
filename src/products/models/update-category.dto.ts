import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCategoryDTO {
  @ApiProperty({
    example: 'Shoes',
    description: 'Category name',
    nullable: false,
    maxLength: 100,
    type: String,
    required: false,
  })
  @IsOptional()
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
}
