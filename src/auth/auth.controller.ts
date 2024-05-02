import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { AuthDto } from './dto/auth.dto'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() body: AuthDto) {
    return this.authService.login(body)
  }

  @Post('register')
  @HttpCode(201)
  register(@Body() body: AuthDto) {
    return this.authService.register(body)
  }
}
