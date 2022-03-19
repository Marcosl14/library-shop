import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { StringMatch } from '../validators/string-match.decorator';

export class UserRegistrationDTO {
  @IsString({
    message: 'FIRSTNAME_MUST_BE_STRING',
  })
  @MinLength(3, {
    message: 'FIRSTNAME_MIN_LENGTH: 3',
  })
  @MaxLength(16, {
    message: 'FIRSTNAME_MAX_LENGTH: 16',
  })
  @ApiProperty({
    description: 'User lastname',
    type: String,
  })
  @ApiProperty({
    description: 'User firstname',
    type: String,
  })
  firstname: string;

  @IsString({
    message: 'LASTNAME_MUST_BE_STRING',
  })
  @MinLength(3, {
    message: 'LASTNAME_MIN_LENGTH: 3',
  })
  @MaxLength(16, {
    message: 'LASTNAME_MAX_LENGTH: 16',
  })
  @ApiProperty({
    description: 'User lastname',
    type: String,
  })
  lastname: string;

  @IsString({
    message: 'PHONE_MUST_BE_STRING',
  })
  @MinLength(6, {
    message: 'PHONE_MIN_LENGTH: 6',
  })
  @MaxLength(30, {
    message: 'PHONE_MAX_LENGTH: 30',
  })
  @ApiProperty({
    description: 'User phone number',
    type: String,
  })
  phone: string;

  @IsString({
    message: 'PASSWORD_MUST_BE_STRING',
  })
  @MinLength(8, {
    message: 'PASSWORD_MIN_LENGTH: 8',
  })
  @MaxLength(16, {
    message: 'PASSWORD_MAX_LENGTH: 16',
  })
  @Matches(/\d/, { message: 'PASSWORD_MISSING: NUMBER' })
  @Matches(/[A-Z]/, {
    message: 'PASSWORD_MISSING: UPPER_CASE_LETTER',
  })
  @Matches(/[a-z]/, {
    message: 'PASSWORDS_MISSING: LOWER_CASE_LETTER',
  })
  @Matches(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, {
    message: 'PASSWORDS_MISSING: SPECIAL_CHARACTER',
  })
  @ApiProperty({
    description: 'User Password',
    type: String,
  })
  password: string;

  @ApiProperty({
    description: 'User Password confirmation',
    type: String,
  })
  @IsString()
  @StringMatch('password', {
    message: 'PASSWORD_CONFIRMATION_NOT_MATCHING',
  })
  passwordConfirmation: string;

  @IsEmail(
    {},
    {
      message: 'EMAIL_NOT_VALID',
    },
  )
  @ApiProperty({
    description: 'User Email',
    type: String,
  })
  email: string;
}
