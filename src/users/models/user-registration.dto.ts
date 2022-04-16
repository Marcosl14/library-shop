import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { StringMatch } from '../validators/string-match.decorator';

export class UserRegistrationDTO {
  @ApiProperty({
    description: 'User firstname',
    type: String,
  })
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
  firstname: string;

  @ApiProperty({
    description: 'User lastname',
    type: String,
  })
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
  lastname: string;

  @ApiProperty({
    description: 'User phone number',
    type: String,
  })
  @IsPhoneNumber(null, { message: 'INVALID_PHONE_NUMBER' })
  phone: string;

  @ApiProperty({
    description: 'User Password',
    type: String,
  })
  @IsString({
    message: 'PASSWORD_MUST_BE_STRING',
  })
  @IsNotEmpty({
    message: 'EMPTY_PASSWORD_FIELD',
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
  password: string;

  @ApiProperty({
    description: 'User Password confirmation',
    type: String,
  })
  @StringMatch('password', {
    message: 'PASSWORD_CONFIRMATION_NOT_MATCHING',
  })
  passwordConfirmation: string;

  @ApiProperty({
    description: 'User Email',
    type: String,
  })
  @MaxLength(100, {
    message: 'EMAIL_MAX_LENGTH: 100',
  })
  @IsEmail(
    {},
    {
      message: 'EMAIL_NOT_VALID',
    },
  )
  email: string;
}
