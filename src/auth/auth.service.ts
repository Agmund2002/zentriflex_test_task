import { HttpException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Prisma } from '@prisma/client'
import { UserService } from 'src/user/user.service'
import { Response } from 'express'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  REFRESH_TOKEN_NAME = 'refreshToken'
  EXPIRE_DAY_REFRESH_TOKEN = 7

  constructor(
    private jwt: JwtService,
    private userService: UserService
  ) {}

  async login(body: Prisma.UserCreateInput) {
    const { password, ...user } = await this.validateUser(body)
    const tokens = this.issueTokens(user.id)

    return {
      user,
      ...tokens
    }
  }

  async register(body: Prisma.UserCreateInput) {
    const userIsExist = await this.userService.findBy({ email: body.email })
    if (userIsExist) throw new HttpException('User already exists', 409)

    const { password, ...user } = await this.userService.create(body)
    const tokens = this.issueTokens(user.id)

    return {
      user,
      ...tokens
    }
  }

  private async validateUser({ email, password }: Prisma.UserCreateInput) {
    const user = await this.userService.findBy({ email })
    if (!user) throw new HttpException('User not found', 404)

    const passwordIsValid = await bcrypt.compare(password, user.password)
    if (!passwordIsValid) throw new HttpException('Invalid password', 401)

    return user
  }

  private issueTokens(id: number) {
    const payload = { id }

    const accessToken = this.jwt.sign(payload, {
      expiresIn: '15m'
    })
    const refreshToken = this.jwt.sign(payload, {
      expiresIn: `${this.EXPIRE_DAY_REFRESH_TOKEN}d`
    })

    return { accessToken, refreshToken }
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date()
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: process.env.DOMAIN,
      expires: expiresIn,
      secure: true,
      sameSite: 'lax'
    })
  }

  removeRefreshTokenFromResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: process.env.DOMAIN,
      expires: new Date(0),
      secure: true,
      sameSite: 'lax'
    })
  }
}
