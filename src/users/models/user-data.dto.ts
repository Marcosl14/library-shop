import { ApiProperty } from '@nestjs/swagger';
import {
  IsLowercase,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserDataDTO {
  @ApiProperty({
    description: 'User firstname',
    type: String,
  })
  @IsOptional()
  @IsString({
    message: 'FIRSTNAME_MUST_BE_STRING',
  })
  @IsNotEmpty({
    message: 'EMPTY_FIRSTNAME_FIELD',
  })
  @MinLength(3, {
    message: 'FIRSTNAME_MIN_LENGTH: 3',
  })
  @MaxLength(16, {
    message: 'FIRSTNAME_MAX_LENGTH: 16',
  })
  @IsLowercase({
    message: 'FIRSTNAME_MUST_BE_LOWERCASE',
  })
  firstname?: string;

  @ApiProperty({
    description: 'User lastname',
    type: String,
  })
  @IsOptional()
  @IsString({
    message: 'LASTNAME_MUST_BE_STRING',
  })
  @IsNotEmpty({
    message: 'EMPTY_LASTNAME_FIELD',
  })
  @MinLength(3, {
    message: 'LASTNAME_MIN_LENGTH: 3',
  })
  @MaxLength(16, {
    message: 'LASTNAME_MAX_LENGTH: 16',
  })
  @IsLowercase({
    message: 'LASTNAME_MUST_BE_LOWERCASE',
  })
  lastname?: string;

  @ApiProperty({
    description: 'User phone number',
    type: String,
  })
  @IsOptional()
  @IsPhoneNumber(null, { message: 'INVALID_PHONE_NUMBER' })
  phone?: string;
}
