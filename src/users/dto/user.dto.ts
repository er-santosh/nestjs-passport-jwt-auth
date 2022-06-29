import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  fullname: string;

  @Expose()
  email: string;
}
