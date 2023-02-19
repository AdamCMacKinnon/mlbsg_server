import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../enums/roles.enum';

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
  @IsOptional()
  @IsBoolean()
  isactive: boolean;
  @IsOptional()
  @IsNumber()
  diff: number;
  @IsOptional()
  @IsEnum(Role)
  role: Role;
  @IsOptional()
  @IsBoolean()
  pastchamp: boolean;
  @IsOptional()
  @IsDateString()
  createdAt: Date;
  @IsOptional()
  @IsDateString()
  updatedAt: Date;
}
