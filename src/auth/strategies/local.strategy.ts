import { UserDocument } from './../../users/entities/user.entity';
import { AuthService } from './../auth.service';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }
  async validate(email: string, password: string): Promise<UserDocument> {
    return this.authService.getAuthenticatedUser(email, password);
  }
}
