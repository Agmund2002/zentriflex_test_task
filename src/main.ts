import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, { abortOnError: false })

    app.setGlobalPrefix('api')
    app.enableCors()
    app.useGlobalPipes(new ValidationPipe())

    await app.listen(process.env.PORT, () =>
      console.log(`Server running. Use our API on port: ${process.env.PORT}`)
    )
  } catch (error) {
    console.log(error.message)
    process.exit(1)
  }
}
bootstrap()
