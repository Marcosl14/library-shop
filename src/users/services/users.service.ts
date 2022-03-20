import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';

import { UserRegistrationDTO } from '../models/user-registration.dto';
import { User } from '../models/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findOneById(id: number): Promise<User | undefined> {
    return this.userRepo.findOne(id);
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepo.findOne({ email: email.toLowerCase() });
  }

  async findOneByRegistryUUID(registryUUID: string): Promise<User | undefined> {
    return this.userRepo.findOne({ registryUUID });
  }

  async updateConfirmRegistration(id: number): Promise<void> {
    this.userRepo.update({ id }, { confirmedRegistration: true });
  }

  async updateRegistryUUID(id: number, registryUUID: uuid): Promise<void> {
    this.userRepo.update({ id }, { registryUUID });
  }

  async findUpdatedAt(id: number): Promise<Date> {
    const user = await this.userRepo.findOne(id, { select: ['updatedAt'] });
    return user.updatedAt;
  }

  async findPassword(id: number): Promise<string> {
    const user = await this.userRepo.findOne(id, { select: ['password'] });
    return user.password;
  }

  async validatePassword(password: string, user: User) {
    const encryptedPassword = await this.findPassword(user.id);

    const isValid = await bcrypt.compare(password, encryptedPassword);

    if (!isValid) {
      throw new HttpException('WRONG_PASSWORD', HttpStatus.FORBIDDEN);
    }
  }

  async updatePassword(id: number, password: string) {
    this.userRepo.update({ id }, { password });
  }

  async create(userDTO: UserRegistrationDTO): Promise<User> {
    userDTO.password = await this.encryptPassword(userDTO.password);

    const user: User = await this.userRepo.create(userDTO);
    return await this.userRepo.save(user);
  }

  async delete(id: number): Promise<void> {
    await this.userRepo.softDelete(id);
  }

  async encryptPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
}
