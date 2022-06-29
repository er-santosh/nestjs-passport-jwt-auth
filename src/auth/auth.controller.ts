import { UsersService } from './../users/users.service';
import { UserDto } from './../users/dto/user.dto';
import { LocalGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SignupUserDto } from './dto/signup-user.dto';
import { RequestWithUser } from './interfaces/requestWithUser.interface';
import { Serialize } from 'src/interceptors/serializer.interceptor';
import JwtRefreshTokenGuard from './guards/jwt-refresh-token.guard';

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  async signup(@Body() signupData: SignupUserDto) {
    return this.authService.signup(signupData);
  }

  @UseGuards(LocalGuard)
  @HttpCode(200)
  @Post('signin')
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const accessTokenCookie = this.authService.getCookieWithJwtToken(
      user._id,
      user.is_admin,
    );

    const refreshTokenCookie =
      await this.authService.getCookieWithJwtRefreshToken(
        user._id,
        user.is_admin,
      );

    await this.usersService.setCurrentRefreshToken(
      refreshTokenCookie.token,
      user._id,
    );
    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie.cookie,
    ]);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    await this.usersService.removeRefreshToken(request.user.id);
    request.res?.setHeader(
      'Set-Cookie',
      this.authService.getCookiesForLogOut(),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authService.getCookieWithJwtRefreshToken(
      request.user.id,
      request.user.is_admin,
    );

    request.res.setHeader('Set-Cookie', accessTokenCookie.cookie);
    return request.user;
  }
}
