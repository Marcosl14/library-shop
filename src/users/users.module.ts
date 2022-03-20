import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { EmailChange } from './models/email-change.entity';
import { User } from './models/user.entity';
import { UsersService } from './services/users.service';
import { EmailChangeService } from './services/email-change.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, EmailChange])],
  controllers: [UsersController],
  providers: [UsersService, EmailChangeService],
  exports: [UsersService],
})
export class UsersModule {}
