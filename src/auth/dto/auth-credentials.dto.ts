import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak!',
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
  @IsBoolean()
  admin: boolean;
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
