import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, { abortOnError: false })

    app.setGlobalPrefix('api')

    app.use(cookieParser())

    app.enableCors({
      credentials: true,
      exposedHeaders: 'set-cookie'
    })

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true
      })
    )

    const config = new DocumentBuilder()
      .setTitle('Zentriflex API')
      .addBearerAuth()
      .addServer('https://zentriflex-test-task.onrender.com/api', 'Production')
      .addServer(`http://localhost:${process.env.PORT}/api`, 'Development')
      .build()
    const document = SwaggerModule.createDocument(app, config, {
      ignoreGlobalPrefix: true
    })
    SwaggerModule.setup('api', app, document)

    await app.listen(process.env.PORT, () =>
      console.log(`Server running. Use our API on port: ${process.env.PORT}`)
    )
  } catch (error) {
    console.log(error.message)
    process.exit(1)
  }
}
bootstrap()
