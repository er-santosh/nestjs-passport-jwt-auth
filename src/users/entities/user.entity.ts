import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Exclude, Transform } from 'class-transformer';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  fullname: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  @Exclude()
  password: string;

  @Prop({ default: false })
  @Exclude()
  is_admin: boolean;

  @Prop({
    default: null,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
