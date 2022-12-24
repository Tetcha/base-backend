import { INestApplication } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';

export const router = (app: INestApplication) => {
  app.setGlobalPrefix('api/v1');

  // Setup Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Base NestJS API')
    .setDescription('The base NestJS API description')
    .setVersion('0.1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/explorer', app, document);
};
