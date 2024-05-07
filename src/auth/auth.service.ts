import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Prisma } from '@prisma/client'
import { UsersService } from 'src/users/users.service'
import { Response } from 'express'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  REFRESH_TOKEN_NAME = 'refreshToken'
  EXPIRE_DAY_REFRESH_TOKEN = 7

  constructor(
    private jwt: JwtService,
    private usersService: UsersService
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
    const userIsExist = await this.usersService.findBy({ email: body.email })
    if (userIsExist) throw new ConflictException('User already exists')

    const { password, ...user } = await this.usersService.create(body)
    const tokens = this.issueTokens(user.id)

    return {
      user,
      ...tokens
    }
  }

  async getNewTokens(refreshToken: string) {
    const payload = await this.jwt.verifyAsync(refreshToken)
    if (!payload) throw new UnauthorizedException('Invalid refresh token')

    const { password, ...user } = await this.usersService.findBy({
      id: payload.id
    })
    if (!user) throw new NotFoundException('User not found')

    const tokens = this.issueTokens(user.id)

    return {
      user,
      ...tokens
    }
  }

  private async validateUser({ email, password }: Prisma.UserCreateInput) {
    const user = await this.usersService.findBy({ email })
    if (!user) throw new NotFoundException('User not found')

    const passwordIsValid = await bcrypt.compare(password, user.password)
    if (!passwordIsValid) throw new UnauthorizedException('Invalid password')

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
