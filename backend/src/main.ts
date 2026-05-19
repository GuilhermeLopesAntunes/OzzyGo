import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {SwaggerModule, DocumentBuilder} from "@nestjs/swagger"
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import cookieParser from "cookie-parser"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService)

  app.use(cookieParser())

  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )

  app.useGlobalFilters(new HttpExceptionFilter())

  const config = new DocumentBuilder()
    .setTitle("OzzyGo API")
    .setDescription(
      "Documentação completa das rotas do Sistema Gamificado OzzyGo"
    )
    .setVersion("1.0")
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api/docs", app, document)

  const port = configService.get<number>("PORT") ?? 3000
  await app.listen(process.env.PORT ?? 3000);

  console.log(`Aplicação Rodando em http://localhost:${port}/api`)
  console.log(`Documentação Swagger em http://localhost:${port}/api/docs`)
}
bootstrap();
