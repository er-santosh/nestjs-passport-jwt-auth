import { ConfigService } from '@nestjs/config';
import { UsersService } from './../users/users.service';
import { SignupUserDto } from './dto/signup-user.dto';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import MongoError from '../utils/mongoError.enum';
import { JwtService } from '@nestjs/jwt';
import TokenPayload from './interfaces/tokenPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async signup(signupData: SignupUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(signupData.password, 10);
      return await this.usersService.create({
        ...signupData,
        password: hashedPassword,
      });
    } catch (error) {
      if (error?.code === MongoError.DuplicateKey) {
        throw new BadRequestException(
          'User with that email/username already exists',
        );
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  public getCookieWithJwtToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      return user;
    } catch (error) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }
}
