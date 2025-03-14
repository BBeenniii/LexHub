import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001;

  app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
  app.use(bodyParser.json());
  app.enableCors();

  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}
bootstrap();