import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { StringMatch } from '../validators/string-match.decorator';

export class PasswordChangeDTO {
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
  password: string;

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
    description: 'User New Password',
    type: String,
  })
  newPassword: string;

  @ApiProperty({
    description: 'User New Password confirmation',
    type: String,
  })
  @IsString()
  @StringMatch('newPassword', {
    message: 'PASSWORD_CONFIRMATION_NOT_MATCHING',
  })
  newPasswordConfirmation: string;
}
