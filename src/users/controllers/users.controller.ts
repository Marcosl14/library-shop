import { Body, Controller, Delete, Get, Req } from '@nestjs/common';
import { UserLoginDTO } from '../models/user-login.dto';
import { User } from '../models/user.entity';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  async username(@Req() req) {
    // first verify if user exists (could be soft-deleted)
    const user: User = await this.userService.findOneByEmail(req.user.email);
    return { username: user.email };
  }

  @Delete()
  async remove(@Req() req, @Body() userDTO: UserLoginDTO) {
    const user: User = await this.userService.findOneByEmail(userDTO.email);

    await this.userService.validatePassword(userDTO.password, user);

    return this.userService.delete(user.id);
  }
}
