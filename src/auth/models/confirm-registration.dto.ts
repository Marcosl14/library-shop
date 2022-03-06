import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ConfirmRegistrationDTO {
  @ApiProperty({
    description: 'Registration Identifier',
    type: String,
  })
  @IsNotEmpty({
    message: 'EMPTY_REGISTRATION_IDENTIFIER',
  })
  registryUUID: string;
}
