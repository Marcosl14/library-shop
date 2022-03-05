import { ApiProperty } from '@nestjs/swagger';

export class UserRegistryDTO {
  @ApiProperty({
    description: 'User Password',
    type: String,
  })
  password: string;

  @ApiProperty({
    description: 'User Password confirmation',
    type: String,
  })
  passwordConfirmation: string;

  @ApiProperty({
    description: 'User Email',
    type: String,
  })
  email: string;
}
