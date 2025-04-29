import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Get,
  Request,
  UseGuards,
  BadRequestException,
  Patch,
} from '@nestjs/common';
import { AuthService, RegistrationStatus } from './auth.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/domains/users/dto/create-user.dto';
import { UtilisateurEntity } from '../users/entities/user.entity';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './decorators/currentUser';
import { ChangePasswordDto, UpdateAuthDto } from './dto/update-auth.dto';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegistrationStatus> {
    const result: RegistrationStatus = await this.authService.register(
      createUserDto,
    );

    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    return await this.authService.login(loginUserDto);
  }

  


  @Post('forgot-password')
  forgotPassword(@Body() body: any) {
    return this.authService.forgotPassword(body.email);
  }

  // @Post('verification-code')
  // verificationCode(@Body() body: any) {
  //   return this.authService.verificationCode(body.code, body.email);
  // }

  @ApiSecurity('apiKey')
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(@CurrentUser() user: any, @Body() body: ChangePasswordDto) {
    return this.authService.changePassword(
      user.email,
      body.password,
      body.confirmPassword,
    );
  }

  @ApiSecurity('apiKey')
  @UseGuards(JwtAuthGuard)
  @Patch('update')
  update(@CurrentUser() user: any, @Body() dto: UpdateAuthDto) {
    return this.authService.update(user.id, dto);
  }
}
