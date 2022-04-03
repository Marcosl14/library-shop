import { ApiHideProperty } from '@nestjs/swagger';
import { v4 as uuid } from 'uuid';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { User } from './user.entity';

@Entity('email_change')
export class EmailChange {
  @ApiHideProperty()
  @Column({
    unsigned: true,
    type: 'uuid',
    primary: true,
    generated: 'uuid',
  })
  uuid: uuid;

  @ApiHideProperty()
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiHideProperty()
  @RelationId((emailChange: EmailChange) => emailChange.user)
  userId: number;

  @ApiHideProperty()
  @Column({
    name: 'old_email',
    type: 'character varying',
    length: 100,
    nullable: false,
  })
  oldEmail: string;

  @ApiHideProperty()
  @Column({
    name: 'new_email',
    type: 'character varying',
    length: 100,
    nullable: false,
  })
  newEmail: string;

  @ApiHideProperty()
  @Column({
    name: 'confirmed',
    type: 'bool',
    default: false,
  })
  confirmed: boolean;

  @ApiHideProperty()
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: null,
    select: false,
  })
  createdAt?: Date;

  @BeforeInsert()
  async lowerCaseAtributes() {
    this.oldEmail = this.oldEmail.toLowerCase();
    this.newEmail = this.newEmail.toLowerCase();
  }
}
