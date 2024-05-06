import { Body, Controller, Delete, HttpCode, Put, Res } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { ProtectedRoute } from 'src/decorators/auth.decorator'
import { CurrentUser } from 'src/decorators/user.decorator'
import { UpdateUserDto } from './dto/update-user.dto'
import { UsersService } from './users.service'
import { AuthService } from 'src/auth/auth.service'
import { Response } from 'express'

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  @Put('current')
  @ProtectedRoute()
  async update(
    @CurrentUser() user: Prisma.UserMinAggregateOutputType,
    @Body() body: UpdateUserDto
  ) {
    const { password, ...response } = await this.usersService.update(user, body)

    return response
  }

  @Delete('current')
  @ProtectedRoute()
  @HttpCode(204)
  async delete(
    @CurrentUser('id') id: number,
    @Res({ passthrough: true }) res: Response
  ) {
    await this.usersService.delete(id)
    this.authService.removeRefreshTokenFromResponse(res)
  }
}
