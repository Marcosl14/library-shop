import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegistryDTO } from '../models/user-registry.dto';
import { User } from '../models/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepo.findOne({ email: email.toLowerCase() });
  }

  async findPassword(id: number): Promise<string> {
    const user = await this.userRepo.findOne(id, { select: ['password'] });
    return user.password;
  }

  async create(userDTO: UserRegistryDTO): Promise<User> {
    const user: User = await this.userRepo.create(userDTO);
    return await this.userRepo.save(user);
  }

  async delete(id: number): Promise<void> {
    await this.userRepo.softDelete(id);
  }
}
