import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
