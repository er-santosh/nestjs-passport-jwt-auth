import { UserDocument } from './../../users/entities/user.entity';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: UserDocument;
}
