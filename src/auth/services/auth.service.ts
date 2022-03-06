import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { UserRegistryDTO } from 'src/users/models/user-registry.dto';
import { User } from 'src/users/models/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { auth_constants } from '../constants/constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
  ) {}

  async validateUser(email: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (!user.confirmedRegistration) {
      throw new HttpException('USER_NOT_REGISTERED', HttpStatus.CONFLICT);
    }

    return user;
  }

  async userExists(userDTO: UserRegistryDTO): Promise<User | undefined> {
    return await this.usersService.findOneByEmail(userDTO.email);
  }

  createRegistryUUID(): uuid {
    return uuid();
  }

  async updateRegistryUUID(userDTO: UserRegistryDTO) {
    const user: User = await this.usersService.findOneByEmail(userDTO.email);

    const registryUUID = this.createRegistryUUID();

    await this.usersService.updateRegistryUUID(user.id, registryUUID);

    this.eventEmitter.emit('confirm.registration', user, registryUUID);
  }

  async createUser(userDTO: UserRegistryDTO) {
    const registryUUID = this.createRegistryUUID();

    const newUser = { ...userDTO, registryUUID };

    const user = await this.usersService.create(newUser);

    this.eventEmitter.emit('confirm.registration', user, registryUUID);
  }

  async login(user: User) {
    const payload = { id: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validatePassword(password: string, user: User) {
    const encryptedPassword = await this.usersService.findPassword(user.id);

    const isValid = await bcrypt.compare(password, encryptedPassword);

    if (!isValid) {
      throw new HttpException('WRONG_PASSWORD', HttpStatus.FORBIDDEN);
    }
  }

  async confirmRegistration(registryUUID: string) {
    const user = await this.usersService.findOneByRegistryUUID(registryUUID);

    if (!user) {
      throw new HttpException('WRONG_REGISTRY_UUID', HttpStatus.FORBIDDEN);
    }

    if (user.confirmedRegistration) {
      throw new HttpException('USER_ALREADY_REGISTERED', HttpStatus.CONFLICT);
    }

    const updatedAt = await this.usersService.findUpdatedAt(user.id);

    if (Date.now() - updatedAt.getTime() > auth_constants.MILLIS_IN_24_HOURS) {
      throw new HttpException('TOKEN_ALREADY_EXPIRED', HttpStatus.CONFLICT);
    }

    this.usersService.updateConfirmRegistration(user.id);
  }
}
