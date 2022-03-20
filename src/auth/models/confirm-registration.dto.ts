import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ConfirmRegistrationDTO {
  @ApiProperty({
    description: 'Registration Identifier',
    type: String,
  })
  @IsUUID('all', {
    message: 'VALUE_IS_NOT_UUID',
  })
  @IsNotEmpty({
    message: 'EMPTY_REGISTRATION_IDENTIFIER',
  })
  registryUUID: string;
}
