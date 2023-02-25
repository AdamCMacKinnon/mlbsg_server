import { Expose } from 'class-transformer';
import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialsDto {
  @Expose()
  id: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: `Password is too weak!  Must be 8 characters long and contain At least one Capital Letter, Number, and Special Character (such as #, ?, !, @, %, $, #)`,
  })
  password: string;

  @IsOptional()
  @IsString()
  email: string;
}
