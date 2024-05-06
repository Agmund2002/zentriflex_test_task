import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Post,
  Req,
  Res
} from '@nestjs/common'
import { AuthDto } from './dto/auth.dto'
import { AuthService } from './auth.service'
import { Request, Response } from 'express'
import { ProtectedRoute } from 'src/decorators/auth.decorator'

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

  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const refreshTokenFromCookies =
      req.cookies[this.authService.REFRESH_TOKEN_NAME]

    if (!refreshTokenFromCookies) {
      this.authService.removeRefreshTokenFromResponse(res)
      throw new HttpException('Refresh token not passed', 401)
    }

    const { refreshToken, ...response } = await this.authService.getNewTokens(
      refreshTokenFromCookies
    )
    this.authService.addRefreshTokenToResponse(res, refreshToken)

    return response
  }

  @Post('logout')
  @ProtectedRoute()
  @HttpCode(204)
  logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshTokenFromResponse(res)
  }
}
