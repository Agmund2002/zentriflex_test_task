import { Body, Controller, Delete, Put } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { ProtectedRoute } from 'src/decorators/auth.decorator'
import { CurrentUser } from 'src/decorators/user.decorator'
import { UpdateUserDto } from './dto/update-user.dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

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
  delete() {}
}
