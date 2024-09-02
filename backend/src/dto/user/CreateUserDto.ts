import { IsEmail, IsString, IsDate, IsEnum, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsDate()
  dateOfBirth: Date;

  @IsEnum(['male', 'female', 'other'])
  gender: string;
}