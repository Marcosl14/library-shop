import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { StringMatch } from '../validators/string-match.decorator';

export class EmailChangeDTO {
  @ApiProperty({
    description: 'User new Email account',
    type: String,
  })
  @IsEmail(
    {},
    {
      message: 'EMAIL_NOT_VALID',
    },
  )
  email: string;

  @ApiProperty({
    description: 'User New Email account confirmation',
    type: String,
  })
  @StringMatch('email', {
    message: 'EMAIL_CONFIRMATION_NOT_MATCHING',
  })
  emailConfirmation: string;
}
