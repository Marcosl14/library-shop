import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserRegistrationDTO } from 'src/users/models/user-registration.dto';
import { UserLoginDTO } from 'src/users/models/user-login.dto';
import { Public } from '../decorators/public.decorator';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ConfirmRegistrationDTO } from '../models/confirm-registration.dto';
import { UsersService } from 'src/users/services/users.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @HttpCode(201)
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: UserRegistrationDTO })
  @ApiOkResponse({
    status: 201,
    description: 'Created',
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
    description: 'Password must be a string',
    status: 400.1,
    schema: {
      example: {
        statusCode: 400,
        message: 'PASSWORD_MUST_BE_STRING',
      },
    },
  })
  @ApiResponse({
    description: 'Password must not be empty',
    status: 400.11,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_PASSWORD_FIELD',
      },
    },
  })
  @ApiResponse({
    description: 'Password min lenght',
    status: 400.12,
    schema: {
      example: {
        statusCode: 400,
        message: 'PASSWORD_MIN_LENGTH: 8',
      },
    },
  })
  @ApiResponse({
    description: 'Password max lenght',
    status: 400.13,
    schema: {
      example: {
        statusCode: 400,
        message: 'PASSWORD_MAX_LENGTH: 16',
      },
    },
  })
  @ApiResponse({
    description: 'Password require a number',
    status: 400.14,
    schema: {
      example: {
        statusCode: 400,
        message: 'PASSWORD_MISSING: NUMBER',
      },
    },
  })
  @ApiResponse({
    description: 'Password require an upper case letter',
    status: 400.15,
    schema: {
      example: {
        statusCode: 400,
        message: 'PASSWORD_MISSING: UPPER_CASE_LETTER',
      },
    },
  })
  @ApiResponse({
    description: 'Password require an lower case letter',
    status: 400.16,
    schema: {
      example: {
        statusCode: 400,
        message: 'PASSWORDS_MISSING: LOWER_CASE_LETTER',
      },
    },
  })
  @ApiResponse({
    description: 'Password require a special character',
    status: 400.17,
    schema: {
      example: {
        statusCode: 400,
        message: 'PASSWORDS_MISSING: SPECIAL_CHARACTER',
      },
    },
  })
  @ApiResponse({
    description: 'Password and password confirmation must be identical',
    status: 400.18,
    schema: {
      example: {
        statusCode: 400,
        message: 'PASSWORD_CONFIRMATION_NOT_MATCHING',
      },
    },
  })
  @ApiResponse({
    description: 'The provided email is not valid',
    status: 400.19,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMAIL_NOT_VALID',
      },
    },
  })
  @ApiResponse({
    description: 'Email must contain less than 100 characters',
    status: 400.2,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMAIL_MAX_LENGTH: 100',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.21,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_FIRSTNAME_FIELD',
      },
    },
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.22,
    schema: {
      example: {
        statusCode: 400,
        message: 'EMPTY_LASTNAME_FIELD',
      },
    },
  })
  @ApiResponse({
    description: 'The user is allready registered',
    status: 409.01,
    schema: {
      example: {
        statusCode: 409,
        message: 'USER_IS_ALREADY_REGISTERED',
      },
    },
  })
  @Public()
  @UseGuards(ThrottlerGuard)
  @Post('register')
  async register(@Body() userDTO: UserRegistrationDTO) {
    const user = await this.authService.userExists(userDTO);

    if (user) {
      if (user.confirmedRegistration) {
        throw new HttpException('USER_ALREADY_REGISTERED', HttpStatus.CONFLICT);
      } else {
        await this.authService.updateRegistryUUID(userDTO);
      }
    } else {
      await this.authService.createUser(userDTO);
    }
  }

  @ApiOperation({ summary: 'Confirm user registration' })
  @ApiBody({ type: ConfirmRegistrationDTO })
  @ApiOkResponse({
    status: 200,
    description: 'User registration successfull',
  })
  @ApiResponse({
    description: 'The provided value is not valid',
    status: 400.01,
    schema: {
      example: {
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
    description: 'The value provided is not a valid uuid for that user',
    status: 404.01,
    schema: {
      example: {
        statusCode: 404,
        message: 'WRONG_REGISTRY_UUID',
      },
    },
  })
  @ApiResponse({
    description: 'The user is already registered',
    status: 409.01,
    schema: {
      example: {
        statusCode: 409,
        message: 'USER_ALREADY_REGISTERED',
      },
    },
  })
  @ApiResponse({
    description: 'Token already expired',
    status: 409.02,
    schema: {
      example: {
        statusCode: 409,
        message: 'TOKEN_ALREADY_EXPIRED',
      },
    },
  })
  @Public()
  @UseGuards(ThrottlerGuard)
  @Post('confirm-registration')
  async confirmRegistration(
    @Body() confirmRegistrationDTO: ConfirmRegistrationDTO,
  ) {
    await this.authService.confirmRegistration(
      confirmRegistrationDTO.registryUUID,
    );
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: UserLoginDTO })
  @ApiOkResponse({
    status: 200,
    description: 'User logged in successfully',
    schema: {
      example: {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IjVAZ21haWwuY29tIiwiaWF0IjoxNjQxOTEzNzUyLCJleHAiOjE2NDE5MTM4MTJ9.MzLodS6l0APNS5Y1l6Gfc8biA1S0TBasUjikB7E_hEU',
      },
    },
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
    description: 'The provided user was not found',
    status: 404.01,
    schema: {
      example: {
        statusCode: 404,
        message: 'USER_NOT_FOUND',
      },
    },
  })
  @Public()
  @UseGuards(LocalAuthGuard, ThrottlerGuard)
  @Post('login')
  async login(@Body() userDTO: UserLoginDTO, @Req() req) {
    await this.userService.validatePassword(userDTO.password, req.user);

    return this.authService.login(req.user);
  }
}
