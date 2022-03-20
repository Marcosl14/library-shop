import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class PasswordForgottenDTO {
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
}
