import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class SignupUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(12)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
