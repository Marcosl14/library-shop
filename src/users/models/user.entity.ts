import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'User id number',
    type: Number,
  })
  @PrimaryGeneratedColumn({
    unsigned: true,
    type: 'bigint',
  })
  id: number;

  @ApiProperty({
    description: 'User firstname',
    type: String,
  })
  @Column({
    name: 'firstname',
    type: 'character varying',
    length: 30,
    nullable: false,
  })
  firstname: string;

  @ApiProperty({
    description: 'User lastname',
    type: String,
  })
  @Column({
    name: 'lastname',
    type: 'character varying',
    length: 30,
    nullable: false,
  })
  lastname: string;

  @ApiProperty({
    description: 'User phone number',
    type: String,
  })
  @Column({
    name: 'phone',
    type: 'character varying',
    length: 50,
    nullable: false,
  })
  phone: string;

  @ApiHideProperty()
  @Column({
    name: 'password',
    type: 'character varying',
    length: 100,
    nullable: false,
    select: false,
  })
  password: string;

  @ApiProperty({
    description: 'User Email',
    type: String,
  })
  @Column({
    name: 'email',
    type: 'character varying',
    length: 100,
    nullable: false,
  })
  email: string;

  @ApiHideProperty()
  @Column({
    name: 'registry_uuid',
    type: 'uuid',
    nullable: false,
    select: false,
  })
  registryUUID: string;

  @ApiHideProperty()
  @Column({
    name: 'confirmed_registration',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  confirmedRegistration: boolean;

  @ApiHideProperty()
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: null,
    select: false,
  })
  createdAt?: Date;

  @ApiHideProperty()
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: null,
    select: false,
  })
  updatedAt?: Date;

  @ApiHideProperty()
  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    default: null,
    select: false,
  })
  deletedAt?: Date;

  @BeforeInsert()
  async lowerCaseAtributes() {
    this.firstname = this.firstname.toLowerCase();
    this.lastname = this.lastname.toLowerCase();
    this.email = this.email.toLowerCase();
  }
}
