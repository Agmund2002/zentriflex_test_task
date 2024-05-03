import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common'
import { AuthDto } from './dto/auth.dto'
import { AuthService } from './auth.service'
import { Response } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: AuthDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { refreshToken, ...response } = await this.authService.login(body)
    this.authService.addRefreshTokenToResponse(res, refreshToken)

    return response
  }

  @Post('register')
  @HttpCode(201)
  async register(
    @Body() body: AuthDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { refreshToken, ...response } = await this.authService.register(body)
    this.authService.addRefreshTokenToResponse(res, refreshToken)

    return response
  }
}
