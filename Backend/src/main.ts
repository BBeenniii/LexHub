import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001;

  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    // Rossz property név esetén:
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => {
      const whitelistErrors = errors.filter(err => err.constraints?.whitelistValidation);

      if (whitelistErrors.length > 0) {
        const messages = whitelistErrors.map(err =>
          `A megadott mező nem létezik: ${err.property}`
        );
        return new BadRequestException({
          message: messages,
          error: 'Bad Request',
          statusCode: 400,
        });
      }

      const otherMessages = errors.flatMap(err =>
        Object.values(err.constraints || {})
      );
    
      return new BadRequestException({
        message: otherMessages,
        error: 'Bad Request',
        statusCode: 400,
      });
    },

    // dto-vá alakítás
    transform: true, 
    transformOptions: {
      enableImplicitConversion: true,
      },
    }),
  );

  // swagger-ös apidoc
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