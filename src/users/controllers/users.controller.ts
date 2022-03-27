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
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import generator from 'generate-password-ts';

import { EmailChangeDTO } from '../models/email-change.dto';
import { PasswordChangeDTO } from '../models/password-change.dto';
import { UserLoginDTO } from '../models/user-login.dto';

import { EmailChange } from '../models/email-change.entity';
import { User } from '../models/user.entity';

import { EmailChangeService } from '../services/email-change.service';
import { UsersService } from '../services/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfirmEmailchangeDTO } from '../models/confirm-email-change.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { PasswordForgottenDTO } from '../models/password-forgotten.dto';
import { UserDataDTO } from '../models/user-data.dto';

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
        firstname: 'Fernando',
        lastname: 'Avocado',
        phone: '351-784231',
        email: 'fernando.avocado@gmail.com',
      },
    },
  })
  @ApiResponse({
    description: 'User token not valid',
    status: 401.01,
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @Get()
  async userData(@Req() req) {
    const { firstname, lastname, phone, email } = req.user;
    return { firstname, lastname, phone, email };
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Change user data' })
  @ApiBody({ type: UserDataDTO })
  @ApiOkResponse({
    status: 200,
    description: 'Data changed',
  })
  @ApiResponse({
    description: 'Firstname must be a string',
    status: 400.01,
    schema: {
      example: {
        statusCode: 400,
        message: 'FIRSTNAME_MUST_BE_STRING',
      },
    },
  })
  @ApiResponse({
    description: 'Firstname must contain at least 3 characters',
    status: 400.02,
    schema: {
      example: {
        statusCode: 400,
        message: 'FIRSTNAME_MIN_LENGTH: 3',
      },
    },
  })
  @ApiResponse({
    description: 'Firstname must contain less than 16 characters',
    status: 400.03,
    schema: {
      example: {
        statusCode: 400,
        message: 'FIRSTNAME_MAX_LENGTH: 16',
      },
    },
  })
  @ApiResponse({
    description: 'Firstname must be lowercase',
    status: 400.04,
    schema: {
      example: {
        statusCode: 400,
        message: 'FIRST_NAME_MUST_BE_LOWERCASE',
      },
    },
  })
  @ApiResponse({
    description: 'Lastname must be a string',
    status: 400.05,
    schema: {
      example: {
        statusCode: 400,
        message: 'LASTNAME_MUST_BE_STRING',
      },
    },
  })
  @ApiResponse({
    description: 'Lastname must contain at least 3 characters',
    status: 400.06,
    schema: {
      example: {
        statusCode: 400,
        message: 'LASTNAME_MIN_LENGTH: 3',
      },
    },
  })
  @ApiResponse({
    description: 'Lastname must contain less than 16 characters',
    status: 400.07,
    schema: {
      example: {
        statusCode: 400,
        message: 'LASTNAME_MAX_LENGTH: 16',
      },
    },
  })
  @ApiResponse({
    description: 'Lastname must be lowercase',
    status: 400.08,
    schema: {
      example: {
        statusCode: 400,
        message: 'LASTNAME_MUST_BE_LOWERCASE',
      },
    },
  })
  @ApiResponse({
    description: 'Improper phone number format',
    status: 400.09,
    schema: {
      example: {
        statusCode: 400,
        message: 'INVALID_PHONE_NUMBER',
      },
    },
  })
  @ApiResponse({
    description: 'User token not valid',
    status: 401.01,
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    description: 'No data sent through the body',
    status: 409.01,
    schema: {
      example: {
        statusCode: 409,
        message: 'EMPTY_BODY',
      },
    },
  })
  @Patch('user_data')
  async changeUserData(@Req() req, @Body() userData: UserDataDTO) {
    if (Object.keys(userData).length === 0) {
      throw new HttpException('EMPTY_BODY', HttpStatus.CONFLICT);
    }

    await this.userService.updateUserData(req.user.id, userData);
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Change user password' })
  @ApiBody({ type: PasswordChangeDTO })
  @ApiOkResponse({
    status: 200,
    description: 'Password changed',
  })
  @ApiResponse({
    description: 'Password must be a string',
    status: 400.01,
    schema: {
      example: {
        statusCode: 400,
        message: 'PASSWORD_MUST_BE_STRING',
      },
    },
  })
  @ApiResponse({
    description: 'Password must not be empty',
    status: 400.02,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_PASSWORD_FIELD',
      },
    },
  })
  @ApiResponse({
    description: 'Password min lenght',
    status: 400.03,
    schema: {
      example: {
        statusCode: 400,
        message: 'PASSWORD_MIN_LENGTH: 8',
      },
    },
  })
  @ApiResponse({
    description: 'Password max lenght',
    status: 400.04,
    schema: {
      example: {
        statusCode: 400,
        message: 'PASSWORD_MAX_LENGTH: 16',
      },
    },
  })
  @ApiResponse({
    description: 'Password require a number',
    status: 400.05,
    schema: {
      example: {
        statusCode: 400,
        message: 'PASSWORD_MISSING: NUMBER',
      },
    },
  })
  @ApiResponse({
    description: 'Password require an upper case letter',
    status: 400.06,
    schema: {
      example: {
        statusCode: 400,
        message: 'PASSWORD_MISSING: UPPER_CASE_LETTER',
      },
    },
  })
  @ApiResponse({
    description: 'Password require an lower case letter',
    status: 400.07,
    schema: {
      example: {
        statusCode: 400,
        message: 'PASSWORDS_MISSING: LOWER_CASE_LETTER',
      },
    },
  })
  @ApiResponse({
    description: 'Password require a special character',
    status: 400.08,
    schema: {
      example: {
        statusCode: 400,
        message: 'PASSWORDS_MISSING: SPECIAL_CHARACTER',
      },
    },
  })
  @ApiResponse({
    description: 'Password and password confirmation must be identical',
    status: 400.09,
    schema: {
      example: {
        statusCode: 400,
        message: 'PASSWORD_CONFIRMATION_NOT_MATCHING',
      },
    },
  })
  @ApiResponse({
    description: 'User token not valid',
    status: 401.01,
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    description: 'The provided password is not valid',
    status: 403.01,
    schema: {
      example: {
        statusCode: 403,
        message: 'WRONG_PASSWORD',
      },
    },
  })
  @ApiResponse({
    description: 'Password and new password are equal',
    status: 409.01,
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

    const user: User = req.user;

    await this.userService.validatePassword(userDTO.password, user);

    const encryptedPassword = await this.userService.encryptPassword(
      userDTO.newPassword,
    );

    await this.userService.updatePassword(user.id, encryptedPassword);
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Change user forgotten password' })
  @ApiBody({ type: PasswordForgottenDTO })
  @ApiOkResponse({
    status: 200,
    description: 'Email with new password sent',
  })
  @ApiResponse({
    description: 'The provided email is not valid',
    status: 400.01,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMAIL_NOT_VALID',
      },
    },
  })
  @ApiResponse({
    description: 'User token not valid',
    status: 401.01,
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @Public()
  @Patch('password_forgotten')
  async passwordForgotten(@Body() userDTO: PasswordForgottenDTO) {
    const user: User = await this.userService.findOneByEmail(userDTO.email);

    const password = generator.generate({
      length: 10,
      numbers: true,
      symbols: true,
    });

    const encryptedPassword = await this.userService.encryptPassword(password);

    await this.userService.updatePassword(user.id, encryptedPassword);

    this.eventEmitter.emit('password.forgotten', user, password);
  }

  @HttpCode(201)
  @ApiOperation({ summary: 'Send email for user email change' })
  @ApiBody({ type: EmailChangeDTO })
  @ApiOkResponse({
    status: 201,
    description: 'Send email for email change',
  })
  @ApiResponse({
    description: 'The provided email is not valid',
    status: 400.01,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMAIL_NOT_VALID',
      },
    },
  })
  @ApiResponse({
    description: 'The provided email and emailConfirmation are not matching',
    status: 400.02,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMAIL_CONFIRMATION_NOT_MATCHING',
      },
    },
  })
  @ApiResponse({
    description: 'User token not valid',
    status: 401.01,
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    description: 'Can´t change to the same email adress',
    status: 409.01,
    schema: {
      example: {
        statusCode: 409,
        message: 'OLDEMAIL_AND_NEWEMAIL_MUST_BE_DIFFERENT',
      },
    },
  })
  @ApiResponse({
    description: 'There is already an email change in progress for that user',
    status: 409.02,
    schema: {
      example: {
        statusCode: 409,
        message: 'EMAIL_CHANGE_ALREADY_IN_PROGRESS',
      },
    },
  })
  @Post('email_change')
  async emailChange(@Req() req, @Body() emailChangeDTO: EmailChangeDTO) {
    const user = req.user;

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
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.01,
    schema: {
      examples: {
        statusCode: 400,
        message: 'VALUE_IS_NOT_UUID',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is empty',
    status: 400.02,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_REGISTRATION_IDENTIFIER',
      },
    },
  })
  @ApiResponse({
    description: 'User token not valid',
    status: 401.01,
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    description: 'The email change was not found or the uuid has expired',
    status: 404.01,
    schema: {
      example: {
        statusCode: 404,
        message: 'EMAIL_CHANGE_NOT_VALID',
      },
    },
  })
  @ApiResponse({
    description: 'The email change was already confirmed',
    status: 409.01,
    schema: {
      example: {
        statusCode: 409,
        message: 'EMAIL_CHANGE_ALREADY_CONFIRMED',
      },
    },
  })
  @Patch('email_change_confirmation')
  async emailchangeConfirmation(
    @Req() req,
    @Body() emailChangeDTO: ConfirmEmailchangeDTO,
  ) {
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

    await this.userService.updateEmail(req.user.id, emailChange.newEmail);

    await this.emailChangeService.updateConfirmation(emailChange.uuid);
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Delete user' })
  @ApiBody({ type: UserLoginDTO })
  @ApiOkResponse({
    status: 200,
    description: 'User deleted',
  })
  @ApiResponse({
    description: 'Password must be a string',
    status: 400.01,
    schema: {
      example: {
        statusCode: 400,
        message: 'PASSWORD_MUST_BE_STRING',
      },
    },
  })
  @ApiResponse({
    description: 'Password must not be empty',
    status: 400.02,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_PASSWORD_FIELD',
      },
    },
  })
  @ApiResponse({
    description: 'The provided email is not valid',
    status: 400.03,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMAIL_NOT_VALID',
      },
    },
  })
  @ApiResponse({
    description: 'User token not valid',
    status: 401.01,
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    description: 'The provided user was not found',
    status: 404.01,
    schema: {
      example: {
        statusCode: 404,
        message: 'USER_NOT_FOUND',
      },
    },
  })
  @Delete()
  async remove(@Req() req, @Body() userDTO: UserLoginDTO) {
    const user: User = req.user;

    if (user.email != userDTO.email) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    await this.userService.validatePassword(userDTO.password, user);

    return this.userService.delete(user.id);
  }
}
