import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { EmailChangeDTO } from '../models/email-change.dto';
import { PasswordChangeDTO } from '../models/password-change.dto';
import { UserLoginDTO } from '../models/user-login.dto';

import { EmailChange } from '../models/email-change.entity';
import { User } from '../models/user.entity';

import { EmailChangeService } from '../services/email-change.service';
import { UsersService } from '../services/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfirmEmailchangeDTO } from '../models/confirm-email-change.dto';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private emailChangeService: EmailChangeService,
    private eventEmitter: EventEmitter2,
  ) {}

  @HttpCode(200)
  @ApiOperation({ summary: 'Get the username' })
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
  @Get()
  async username(@Req() req) {
    const user: User = await this.userService.findOneById(req.user.id);
    return { username: user.email };
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Change user password' })
  @ApiBody({ type: UserLoginDTO })
  @ApiOkResponse({
    status: 200,
    description: 'Password changed',
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
  @ApiForbiddenResponse({
    description: 'The provided password is not valid',
    status: 403,
    schema: {
      example: {
        statusCode: 403,
        message: 'WRONG_PASSWORD',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Password and new password are equal',
    status: 409,
    schema: {
      example: {
        statusCode: 409,
        message: 'PASSWORD_AND_NEWPASSWORD_MUST_BE_DIFFERENT',
      },
    },
  })
  @Patch('password_change')
  async passwordChange(@Req() req, @Body() userDTO: PasswordChangeDTO) {
    if (userDTO.password === userDTO.newPassword) {
      throw new HttpException(
        'PASSWORD_AND_NEWPASSWORD_MUST_BE_DIFFERENT',
        HttpStatus.CONFLICT,
      );
    }

    const user = await this.userService.findOneById(req.user.id);

    await this.userService.validatePassword(userDTO.password, user);

    const encryptedPassword = await this.userService.encryptPassword(
      userDTO.newPassword,
    );

    await this.userService.updatePassword(req.user.id, encryptedPassword);
  }

  @HttpCode(201)
  @ApiOperation({ summary: 'Send email for user email change' })
  @ApiBody({ type: EmailChangeDTO })
  @ApiOkResponse({
    status: 201,
    description: 'Send email for email change',
  })
  @ApiForbiddenResponse({
    description: 'The provided email is not valid',
    status: 400,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMAIL_NOT_VALID',
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
  @ApiConflictResponse({
    description: 'The provided email and emailConfirmation are not matching',
    status: 400,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMAIL_CONFIRMATION_NOT_MATCHING',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Can´t change to the same email adress',
    status: 409,
    schema: {
      example: {
        statusCode: 409,
        message: 'OLDEMAIL_AND_NEWEMAIL_MUST_BE_DIFFERENT',
      },
    },
  })
  @ApiConflictResponse({
    description: 'There is already an email change in progress for that user',
    status: 409,
    schema: {
      example: {
        statusCode: 409,
        message: 'EMAIL_CHANGE_ALREADY_IN_PROGRESS',
      },
    },
  })
  @Post('email_change')
  async emailChange(@Req() req, @Body() emailChangeDTO: EmailChangeDTO) {
    const user = await this.userService.findOneById(req.user.id);

    if (emailChangeDTO.email === user.email) {
      throw new HttpException(
        'OLDEMAIL_AND_NEWEMAIL_MUST_BE_DIFFERENT',
        HttpStatus.CONFLICT,
      );
    }

    if (await this.emailChangeService.isEmailChangeInProgress(user)) {
      throw new HttpException(
        'EMAIL_CHANGE_ALREADY_IN_PROGRESS',
        HttpStatus.CONFLICT,
      );
    }

    const emailchange: EmailChange = await this.emailChangeService.create(
      emailChangeDTO.email,
      user,
    );

    this.eventEmitter.emit('email_change.in_progress', emailchange);
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Email change confirmation' })
  @ApiBody({ type: ConfirmEmailchangeDTO })
  @ApiOkResponse({
    status: 200,
    description: 'Email changed',
  })
  @ApiForbiddenResponse({
    description: 'The provided value is not valid',
    status: 400,
    schema: {
      example: {
        statusCode: 400,
        message: 'VALUE_IS_NOT_UUID',
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'The provided value is empty',
    status: 400,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_REGISTRATION_IDENTIFIER',
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
  @ApiConflictResponse({
    description: 'The email change was not found or the uuid has expired',
    status: 404,
    schema: {
      example: {
        statusCode: 404,
        message: 'EMAIL_CHANGE_NOT_VALID',
      },
    },
  })
  @ApiConflictResponse({
    description: 'The email change was already confirmed',
    status: 409,
    schema: {
      example: {
        statusCode: 409,
        message: 'EMAIL_CHANGE_ALREADY_CONFIRMED',
      },
    },
  })
  @Patch('email_change_confirmation')
  async emailchangeConfirmation(@Body() emailChangeDTO: ConfirmEmailchangeDTO) {
    const emailChange: EmailChange =
      await this.emailChangeService.isEmailChangeValid(
        emailChangeDTO.emailChangeUUID,
      );

    if (!emailChange) {
      throw new HttpException('EMAIL_CHANGE_NOT_VALID', HttpStatus.NOT_FOUND);
    }

    if (emailChange.confirmed) {
      throw new HttpException(
        'EMAIL_CHANGE_ALREADY_CONFIRMED',
        HttpStatus.CONFLICT,
      );
    }

    await this.emailChangeService.updateconfirmation(emailChange.uuid);
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
    const user: User = await this.userService.findOneById(req.user.id);

    if (user.email != userDTO.email) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    await this.userService.validatePassword(userDTO.password, user);

    return this.userService.delete(user.id);
  }
}
