import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { LOGGER } from '@shared/logger';
import { AppModule } from './app.module';
import { exceptionFactory } from '@libs/api-utils/validation/exception.factory';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: LOGGER,
  });

  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, exceptionFactory }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}

bootstrap().catch((error) => {
  LOGGER.error(error);
});
