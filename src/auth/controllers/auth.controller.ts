import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRegistryDTO } from 'src/users/models/user-registry.dto';
import { UserLoginDTO } from 'src/users/models/user-login.dto';
import { Public } from '../decorators/public.decorator';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(ThrottlerGuard)
  @Post('register')
  async register(@Body() userDTO: UserRegistryDTO) {
    await this.authService.userExists(userDTO);

    userDTO.password = await this.encryptPassword(userDTO.password);

    await this.authService.createUser(userDTO);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @UseGuards(ThrottlerGuard)
  @Post('login')
  async login(@Body() userDTO: UserLoginDTO, @Req() req) {
    await this.authService.validatePassword(userDTO.password, req.user);

    return this.authService.login(req.user);
  }

  async encryptPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
}
