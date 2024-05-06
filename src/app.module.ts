import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { IsEmptyBodyMiddleware } from './middlewares/is-empty-body.middleware'

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UsersModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsEmptyBodyMiddleware)
      .forRoutes({ path: 'users/current', method: RequestMethod.PUT })
  }
}
