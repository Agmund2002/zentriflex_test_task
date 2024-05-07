import * as NestCommon from '@nestjs/common'
import * as Swagger from '@nestjs/swagger'
import { LoginDto, RegisterDto } from './dto/auth.dto'
import { AuthService } from './auth.service'
import { Request, Response } from 'express'
import { ProtectedRoute } from 'src/decorators/auth.decorator'
import { AuthResponseExample } from 'src/examples/swagger/auth.example'
import {
  BadRequestResponseExample,
  ConflictResponseExample,
  NotFoundResponseExample,
  UnauthorizedResponseExample
} from 'src/examples/swagger/errors.example'

@Swagger.ApiTags('Auth')
@NestCommon.Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Swagger.ApiOperation({ summary: 'Login user' })
  @Swagger.ApiOkResponse(AuthResponseExample)
  @Swagger.ApiBadRequestResponse(BadRequestResponseExample)
  @Swagger.ApiUnauthorizedResponse(UnauthorizedResponseExample)
  @Swagger.ApiNotFoundResponse(NotFoundResponseExample)
  @NestCommon.Post('login')
  @NestCommon.HttpCode(200)
  async login(
    @NestCommon.Body() body: LoginDto,
    @NestCommon.Res({ passthrough: true }) res: Response
  ) {
    const { refreshToken, ...response } = await this.authService.login(body)
    this.authService.addRefreshTokenToResponse(res, refreshToken)

    return response
  }

  @Swagger.ApiOperation({ summary: 'Register user' })
  @Swagger.ApiCreatedResponse(AuthResponseExample)
  @Swagger.ApiBadRequestResponse(BadRequestResponseExample)
  @Swagger.ApiConflictResponse(ConflictResponseExample)
  @NestCommon.Post('register')
  async register(
    @NestCommon.Body() body: RegisterDto,
    @NestCommon.Res({ passthrough: true }) res: Response
  ) {
    const { refreshToken, ...response } = await this.authService.register(body)
    this.authService.addRefreshTokenToResponse(res, refreshToken)

    return response
  }

  @Swagger.ApiOperation({ summary: 'Refresh tokens' })
  @Swagger.ApiOkResponse(AuthResponseExample)
  @Swagger.ApiUnauthorizedResponse(UnauthorizedResponseExample)
  @Swagger.ApiNotFoundResponse(NotFoundResponseExample)
  @NestCommon.Post('refresh')
  @NestCommon.HttpCode(200)
  async refresh(
    @NestCommon.Req() req: Request,
    @NestCommon.Res({ passthrough: true }) res: Response
  ) {
    const refreshTokenFromCookies =
      req.cookies[this.authService.REFRESH_TOKEN_NAME]

    if (!refreshTokenFromCookies) {
      this.authService.removeRefreshTokenFromResponse(res)
      throw new NestCommon.UnauthorizedException('Refresh token not passed')
    }

    const { refreshToken, ...response } = await this.authService.getNewTokens(
      refreshTokenFromCookies
    )
    this.authService.addRefreshTokenToResponse(res, refreshToken)

    return response
  }

  @Swagger.ApiOperation({ summary: 'Logout' })
  @Swagger.ApiNoContentResponse({ description: 'No content' })
  @Swagger.ApiUnauthorizedResponse(UnauthorizedResponseExample)
  @Swagger.ApiNotFoundResponse(NotFoundResponseExample)
  @Swagger.ApiBearerAuth()
  @ProtectedRoute()
  @NestCommon.Post('logout')
  @NestCommon.HttpCode(204)
  logout(@NestCommon.Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshTokenFromResponse(res)
  }
}
