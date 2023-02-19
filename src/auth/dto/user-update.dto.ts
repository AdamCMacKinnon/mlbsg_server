import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';

export class UserUpdateDto {
  username?: string;
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: `Password is too weak!  Must be at least 8 characters long and contain At least one Capital Letter, Number, and Special Character (such as #, ?, !, @, %, $, #)`,
  })
  password?: string;
}
