import { ApiProperty } from '@nestjs/swagger';
import {
  IsLowercase,
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
  @IsString({
    message: 'FIRSTNAME_MUST_BE_STRING',
  })
  @MinLength(3, {
    message: 'FIRSTNAME_MIN_LENGTH: 3',
  })
  @MaxLength(16, {
    message: 'FIRSTNAME_MAX_LENGTH: 16',
  })
  @IsLowercase({
    message: 'FIRST_NAME_MUST_BE_LOWERCASE',
  })
  firstname: string;

  @ApiProperty({
    description: 'User lastname',
    type: String,
  })
  @IsString({
    message: 'LASTNAME_MUST_BE_STRING',
  })
  @MinLength(3, {
    message: 'LASTNAME_MIN_LENGTH: 3',
  })
  @MaxLength(16, {
    message: 'LASTNAME_MAX_LENGTH: 16',
  })
  @IsLowercase({
    message: 'LAST_NAME_MUST_BE_LOWERCASE',
  })
  lastname: string;

  @IsPhoneNumber(null, { message: 'INVALID_PHONE_NUMBER' })
  @ApiProperty({
    description: 'User phone number',
    type: String,
  })
  phone: string;
}
