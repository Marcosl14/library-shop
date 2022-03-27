import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import { UserRegistrationDTO } from 'src/users/models/user-registration.dto';
import { User } from 'src/users/models/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { globalConstants } from '../../constants/global.constants';
import { UserLoginDTO } from 'src/users/models/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
  ) {}

  async validateUserJWT(payload: any): Promise<any> {
    const user = await this.usersService.findOneById(payload.id);

    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (user.email != payload.email) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (user.registryUUID != payload.registryUUID) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async validateUserLocal(email: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (!user.confirmedRegistration) {
      throw new HttpException('USER_NOT_REGISTERED', HttpStatus.CONFLICT);
    }

    return user;
  }

  async userExists(
    userDTO: UserRegistrationDTO | UserLoginDTO,
  ): Promise<User | undefined> {
    return await this.usersService.findOneByEmail(userDTO.email);
  }

  async updateRegistryUUID(userDTO: UserRegistrationDTO) {
    const user: User = await this.usersService.findOneByEmail(userDTO.email);

    const registryUUID = await this.usersService.updateRegistryUUID(user.id);

    this.eventEmitter.emit('registration.update_uuid', user, registryUUID);
  }

  createRegistryUUID(): uuid {
    return uuid();
  }

  async createUser(userDTO: UserRegistrationDTO) {
    const registryUUID = this.createRegistryUUID();

    const newUser = { ...userDTO, registryUUID };

    const user = await this.usersService.create(newUser);

    this.eventEmitter.emit('registration.in_progress', user, registryUUID);
  }

  async login(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      registryUUID: user.registryUUID,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
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

    if (Date.now() - updatedAt.getTime() > globalConstants.MILLIS_IN_24_HOURS) {
      throw new HttpException('TOKEN_ALREADY_EXPIRED', HttpStatus.CONFLICT);
    }

    this.usersService.updateConfirmRegistration(user.id);
  }
}
