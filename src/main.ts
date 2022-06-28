import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // reject extra properties acc to dto
      transform: true, // auto transform datatype
    }),
  );
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
