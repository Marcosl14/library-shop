import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ConfirmEmailchangeDTO {
  @ApiProperty({
    description: 'Email Change Identifier',
    type: String,
  })
  @IsUUID('all', {
    message: 'VALUE_IS_NOT_UUID',
  })
  @IsNotEmpty({
    message: 'EMPTY_REGISTRATION_IDENTIFIER',
  })
  emailChangeUUID: string;
}
