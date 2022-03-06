import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRegistryDTO } from 'src/users/models/user-registry.dto';
import { User } from 'src/users/models/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

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

    return user;
  }

  async userExists(userDTO: UserRegistryDTO) {
    const user = await this.usersService.findOneByEmail(userDTO.email);

    if (user) {
      throw new HttpException(
        'USER_IS_ALREADY_REGISTERED',
        HttpStatus.CONFLICT,
      );
    }
  }

  async createUser(userDTO: UserRegistryDTO) {
    const user = await this.usersService.create(userDTO);

    this.eventEmitter.emit('user.created', user);
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
}
