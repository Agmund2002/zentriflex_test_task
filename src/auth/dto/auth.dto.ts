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
  @ApiProperty({ example: 'example@mail.com' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string

  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name?: string

  @ApiProperty({ example: 'qwe123qwe' })
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
