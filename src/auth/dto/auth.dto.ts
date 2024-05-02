import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator'

export class AuthDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string

  @IsString()
  @IsOptional()
  @MaxLength(50)
  name?: string

  @IsString()
  @MinLength(6, {
    message: 'Password must be at least 6 characters long'
  })
  @MaxLength(15, {
    message: 'The password must be no more than 15 characters'
  })
  password: string
}
