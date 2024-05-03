import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
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

  private hashPassword(password: string) {
    return bcrypt.hash(password, 10)
  }
}
