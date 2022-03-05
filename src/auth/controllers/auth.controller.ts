import { Body, Controller, Post } from '@nestjs/common';
import { UserRegistryDTO } from 'src/users/models/user-registry.dto';
import { UserLoginDTO } from 'src/users/models/user-login.dto';
import { Public } from '../decorators/public.decorator';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() user: UserRegistryDTO) {
    console.log('TBD');
  }

  @Public()
  @Post('login')
  async login(@Body() user: UserLoginDTO) {
    return this.authService.login(user);
  }
}
