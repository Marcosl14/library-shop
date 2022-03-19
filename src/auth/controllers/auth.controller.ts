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
import { isUUID } from 'class-validator';
import { UsersService } from 'src/users/services/users.service';
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
  @ApiConflictResponse({
    description: 'The user is allready registered',
    status: 409,
    schema: {
      examples: {
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
        console.log();
        // ésto hay que verlo bien, porque si el user cambió algun parámetro, por ejemplo,
        // password o teléfono, no lo estaríamos validando, ni incluso, almacenando en la BD.
        // lo correcto sería crear otro endpoint, para reenviar el mail con un nuevo UUID.

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
    schema: {
      example: {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IjVAZ21haWwuY29tIiwiaWF0IjoxNjQxOTEzNzUyLCJleHAiOjE2NDE5MTM4MTJ9.MzLodS6l0APNS5Y1l6Gfc8biA1S0TBasUjikB7E_hEU',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'The value provided is not a valid uuid for that user',
    status: 404,
    schema: {
      example: {
        statusCode: 404,
        message: 'WRONG_REGISTRY_UUID',
      },
    },
  })
  @ApiConflictResponse({
    description: 'The value provided is not a uuid',
    status: 409,
    schema: {
      example: {
        statusCode: 409,
        message: 'VALUE_IS_NOT_UUID',
      },
    },
  })
  @ApiConflictResponse({
    description: 'The user is already registered',
    status: 409,
    schema: {
      example: {
        statusCode: 409,
        message: 'USER_ALREADY_REGISTERED',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Token already expired',
    status: 409,
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
    if (!isUUID(confirmRegistrationDTO.registryUUID)) {
      throw new HttpException('VALUE_IS_NOT_UUID', HttpStatus.CONFLICT);
    }

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
      examples: {
        statusCode: 403,
        message: 'WRONG_PASSWORD',
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
  @Public()
  @UseGuards(LocalAuthGuard, ThrottlerGuard)
  @Post('login')
  async login(@Body() userDTO: UserLoginDTO, @Req() req) {
    await this.userService.validatePassword(userDTO.password, req.user);

    return this.authService.login(req.user);
  }
}
