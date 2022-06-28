import { UserDocument } from './../../users/entities/user.entity';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: UserDocument;
}

export default RequestWithUser;
