import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDTO {
  @ApiProperty({
    description: 'User Password',
    type: String,
  })
  password: string;

  @ApiProperty({
    description: 'User Email',
    type: String,
  })
  email: string;
}
