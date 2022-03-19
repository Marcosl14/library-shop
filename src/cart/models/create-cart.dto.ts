import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export class Cart {
  @ApiProperty({
    description: 'User Id',
    type: Number,
  })
  @Column({
    type: 'number',
  })
  userId: number;
}
