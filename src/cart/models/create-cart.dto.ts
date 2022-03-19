import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/models/user.entity';

export class CreateCartDTO {
  @ApiProperty({
    description: 'User Id',
    type: Number,
  })
  user: User;
}
