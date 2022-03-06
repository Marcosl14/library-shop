import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDTO {
  @ApiProperty({
    description: 'User Password',
    type: String,
  })
  @IsString({
    message: 'PASSWORD_MUST_BE_A_STRING',
  })
  @IsNotEmpty({
    message: 'EMPTY_PASSWORD_FIELD',
  })
  password: string;

  @ApiProperty({
    description: 'User Email',
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
