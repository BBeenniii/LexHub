import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001;

  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true, 
    transformOptions: {
      enableImplicitConversion: true,
      },
    }),
  );

  const docConfig = new DocumentBuilder()
    .setTitle('LexHub')
    .setDescription('LexHub valós idejű ügyfél–ügyvéd rendszer API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup('apidoc', app, document);

  app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
  app.use(bodyParser.json());
  app.enableCors();

  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Swagger available at http://localhost:${port}/apidoc`);
}
bootstrap();