import { Controller, Delete, Get, Req } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  async username(@Req() req) {
    return { username: req.user.email };
  }

  @Delete()
  async remove(@Req() req) {
    return this.userService.delete(req.user.id);
  }
}
