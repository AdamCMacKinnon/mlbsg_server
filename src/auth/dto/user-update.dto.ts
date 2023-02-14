import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class UserUpdateDto {
  username?: string;
  email?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak!',
  })
  password?: string;
}
