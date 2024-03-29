import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
  );

  if (process.env.NODE_ENV == 'development') {
    const config = new DocumentBuilder()
      .setTitle('Library-Shop API')
      .setDescription('The API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const options: SwaggerDocumentOptions = {
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        methodKey,
    };

    const document = SwaggerModule.createDocument(app, config, options);

    SwaggerModule.setup('api', app, document);
  }

  await app.listen(parseInt(process.env.PORT) || 3000);
}
bootstrap();
