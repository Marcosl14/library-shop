import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserLoginDTO } from '../models/user-login.dto';
import { User } from '../models/user.entity';
import { UsersService } from '../services/users.service';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @HttpCode(200)
  @ApiOperation({ summary: 'Get the username' })
  @ApiBody({ type: UserLoginDTO })
  @ApiOkResponse({
    status: 200,
    description: 'Get the username',
    schema: {
      example: {
        username: 'marcos.giordano.l14@googlemail.com',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'User token not valid',
    status: 401,
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'The provided user was not found',
    status: 404,
    schema: {
      example: {
        statusCode: 404,
        message: 'USER_NOT_FOUND',
      },
    },
  })
  @Get()
  async username(@Req() req) {
    // first verify if user exists (could be soft-deleted)
    const user: User = await this.userService.findOneByEmail(req.user.email);
    return { username: user.email };
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Delete user' })
  @ApiBody({ type: UserLoginDTO })
  @ApiOkResponse({
    status: 200,
    description: 'User deleted',
  })
  @ApiUnauthorizedResponse({
    description: 'User token not valid',
    status: 401,
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'The provided user was not found',
    status: 404,
    schema: {
      example: {
        statusCode: 404,
        message: 'USER_NOT_FOUND',
      },
    },
  })
  @Delete()
  async remove(@Req() req, @Body() userDTO: UserLoginDTO) {
    const user: User = await this.userService.findOneByEmail(userDTO.email);

    if (!user) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    await this.userService.validatePassword(userDTO.password, user);

    return this.userService.delete(user.id);
  }
}
