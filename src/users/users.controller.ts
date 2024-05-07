import * as NestCommon from '@nestjs/common'
import * as Swagger from '@nestjs/swagger'
import { Prisma } from '@prisma/client'
import { Response } from 'express'
import { ProtectedRoute } from 'src/decorators/auth.decorator'
import { CurrentUser } from 'src/decorators/user.decorator'
import { UpdateUserDto } from './dto/update-user.dto'
import { UsersService } from './users.service'
import { AuthService } from 'src/auth/auth.service'
import { UsersResponseExample } from 'src/examples/swagger/user.example'
import {
  BadRequestResponseExample,
  ConflictResponseExample,
  NotFoundResponseExample,
  UnauthorizedResponseExample
} from 'src/examples/swagger/errors.example'

@Swagger.ApiTags('Users')
@NestCommon.Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  @Swagger.ApiOperation({ summary: 'Update user' })
  @Swagger.ApiOkResponse(UsersResponseExample)
  @Swagger.ApiBadRequestResponse(BadRequestResponseExample)
  @Swagger.ApiUnauthorizedResponse(UnauthorizedResponseExample)
  @Swagger.ApiNotFoundResponse(NotFoundResponseExample)
  @Swagger.ApiConflictResponse(ConflictResponseExample)
  @Swagger.ApiBearerAuth()
  @ProtectedRoute()
  @NestCommon.Put('current')
  async update(
    @CurrentUser() user: Prisma.UserMinAggregateOutputType,
    @NestCommon.Body() body: UpdateUserDto
  ) {
    const { password, ...response } = await this.usersService.update(user, body)

    return response
  }

  @Swagger.ApiOperation({ summary: 'Delete user' })
  @Swagger.ApiNoContentResponse({ description: 'No content' })
  @Swagger.ApiUnauthorizedResponse(UnauthorizedResponseExample)
  @Swagger.ApiNotFoundResponse(NotFoundResponseExample)
  @Swagger.ApiBearerAuth()
  @ProtectedRoute()
  @NestCommon.Delete('current')
  @NestCommon.HttpCode(204)
  async delete(
    @CurrentUser('id') id: number,
    @NestCommon.Res({ passthrough: true }) res: Response
  ) {
    await this.usersService.delete(id)
    this.authService.removeRefreshTokenFromResponse(res)
  }
}
