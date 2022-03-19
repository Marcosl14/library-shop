import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserRegistryDTO } from 'src/users/models/user-registry.dto';
import { UserLoginDTO } from 'src/users/models/user-login.dto';
import { Public } from '../decorators/public.decorator';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ConfirmRegistrationDTO } from '../models/confirm-registration.dto';
import { isUUID } from 'class-validator';
import { UsersService } from 'src/users/services/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Public()
  @UseGuards(ThrottlerGuard)
  @Post('register')
  async register(@Body() userDTO: UserRegistryDTO) {
    const user = await this.authService.userExists(userDTO);

    if (user) {
      if (user.confirmedRegistration) {
        throw new HttpException('USER_ALREADY_REGISTERED', HttpStatus.CONFLICT);
      } else {
        console.log();
        // ésto hay que verlo bien, porque si el user cambió algun parámetro, por ejemplo,
        // password o teléfono, no lo estaríamos validando, ni incluso, almacenando en la BD.
        // lo correcto sería crear otro endpoint, para reenviar el mail con un nuevo UUID.

        await this.authService.updateRegistryUUID(userDTO);
      }
    } else {
      await this.authService.createUser(userDTO);
    }
  }

  @Public()
  @UseGuards(ThrottlerGuard)
  @Post('confirm-registration')
  async confirmRegistration(
    @Body() confirmRegistrationDTO: ConfirmRegistrationDTO,
  ) {
    if (!isUUID(confirmRegistrationDTO.registryUUID)) {
      throw new HttpException('VALUE_IS_NOT_UUID', HttpStatus.CONFLICT);
    }

    await this.authService.confirmRegistration(
      confirmRegistrationDTO.registryUUID,
    );
  }

  @Public()
  @UseGuards(LocalAuthGuard, ThrottlerGuard)
  @Post('login')
  async login(@Body() userDTO: UserLoginDTO, @Req() req) {
    await this.userService.validatePassword(userDTO.password, req.user);

    return this.authService.login(req.user);
  }
}
