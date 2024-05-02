import { HttpException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Prisma } from '@prisma/client'
import { UserService } from 'src/user/user.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
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
      expiresIn: '1h'
    })
    const refreshToken = this.jwt.sign(payload, {
      expiresIn: '7d'
    })

    return { accessToken, refreshToken }
  }
}
