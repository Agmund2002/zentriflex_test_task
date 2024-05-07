import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class IsEmptyBodyMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    const { length } = Object.keys(req.body)
    if (!length) throw new BadRequestException(['missing fields'])

    next()
  }
}
