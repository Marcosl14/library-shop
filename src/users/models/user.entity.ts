import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/auth/models/role.enum';
import { Cart } from 'src/cart/models/cart.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmailChange } from './email-change.entity';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'User id number',
    readOnly: true,
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
  })
  createdAt?: Date;

  @ApiHideProperty()
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: null,
  })
  updatedAt?: Date;

  @ApiHideProperty()
  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    default: null,
  })
  deletedAt?: Date;

  @ApiHideProperty()
  @Column({
    name: 'roles',
    type: 'character varying',
    length: 20,
    nullable: true,
    select: true,
    default: Role.User,
  })
  roles: Role[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @OneToMany(() => EmailChange, (emailChange) => emailChange.user)
  emailChange: EmailChange[];

  @BeforeInsert()
  async lowerCaseAtributes() {
    this.firstname = this.firstname
      ? this.firstname.toLowerCase()
      : this.firstname;

    this.lastname = this.lastname ? this.lastname.toLowerCase() : this.lastname;

    this.email = this.email ? this.email.toLowerCase() : this.email;
  }
}
