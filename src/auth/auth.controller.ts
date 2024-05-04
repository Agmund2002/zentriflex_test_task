import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common'
import { AuthDto } from './dto/auth.dto'
import { AuthService } from './auth.service'
import { Response } from 'express'
import { Auth } from 'src/decorators/auth.decorator'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() body: AuthDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { refreshToken, ...response } = await this.authService.login(body)
    this.authService.addRefreshTokenToResponse(res, refreshToken)

    return response
  }

  @Post('register')
  async register(
    @Body() body: AuthDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { refreshToken, ...response } = await this.authService.register(body)
    this.authService.addRefreshTokenToResponse(res, refreshToken)

    return response
  }

  @Post('logout')
  @Auth()
  @HttpCode(204)
  logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshTokenFromResponse(res)
  }
}
