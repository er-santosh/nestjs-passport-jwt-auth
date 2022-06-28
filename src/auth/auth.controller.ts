import LocalGuard from './guards/local.guard';
import JwtAuthGuard from './guards/jwt.guard';
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
import RequestWithUser from './interfaces/requestWithUser.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupData: SignupUserDto) {
    return this.authService.signup(signupData);
  }

  @UseGuards(LocalGuard)
  @HttpCode(200)
  @Post('signin')
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const cookie = this.authService.getCookieWithJwtToken(user._id);
    request.res?.setHeader('Set-Cookie', cookie);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    request.res?.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }
}
