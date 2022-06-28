import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Exclude, Transform } from 'class-transformer';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ unique: true })
  username: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  @Exclude()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
