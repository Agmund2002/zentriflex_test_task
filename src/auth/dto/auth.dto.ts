import { ApiProperty, OmitType } from '@nestjs/swagger'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator'

export class RegisterDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name?: string

  @ApiProperty()
  @IsString()
  @MinLength(6, {
    message: 'Password must be at least 6 characters long'
  })
  @MaxLength(15, {
    message: 'The password must be no more than 15 characters'
  })
  password: string
}

export class LoginDto extends OmitType(RegisterDto, ['name']) {}
