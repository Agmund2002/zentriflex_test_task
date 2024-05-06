import { HttpException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findBy(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({ where })
  }

  async create(body: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data: {
        ...body,
        password: await this.hashPassword(body.password)
      }
    })
  }

  async update(
    user: Prisma.UserMinAggregateOutputType,
    body: Prisma.UserUpdateInput
  ) {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: await this.checkFieldsToUpdate(user, body)
    })
    if (!updatedUser) throw new HttpException('User not found', 404)

    return updatedUser
  }

  async delete(id: number) {
    const deletedUser = await this.prisma.user.delete({
      where: {
        id
      }
    })
    if (!deletedUser) throw new HttpException('User not found', 404)

    return deletedUser
  }

  private async checkFieldsToUpdate(
    user: Prisma.UserMinAggregateOutputType,
    body: Prisma.UserUpdateInput
  ) {
    const { email: userEmail, password: userPassword } = user
    const { email, password } = body

    if (email && email !== userEmail) {
      const findUser = await this.findBy({ email: email as string })
      if (findUser) throw new HttpException('Email already exist', 409)
    }

    let hashedPassword = userPassword

    if (password) {
      hashedPassword = await this.hashPassword(password as string)
    }

    return {
      ...body,
      password: hashedPassword
    }
  }

  private hashPassword(password: string) {
    return bcrypt.hash(password, 10)
  }
}
