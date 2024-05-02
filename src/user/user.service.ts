import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  findBy(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({ where })
  }
}
