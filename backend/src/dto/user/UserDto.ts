

import { IsUUID, IsEmail, IsString, IsDate, IsEnum } from 'class-validator';

export class UserDto {
  @IsUUID()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsDate()
  dateOfBirth: Date;

  @IsEnum(['male', 'female', 'other'])
  gender: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}