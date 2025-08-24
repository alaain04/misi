import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@shared/logger';
import { ApiModule } from '@apps/api/api.module';
import {
  APP_MODE,
  LoggerMiddleware,
  registerWhenAppMode,
} from '@libs/api-utils';
import { PrismaModule } from '@shared/database/prisma.module';
import { SqsModule } from '@shared/aws/sqs';
import { ManagerModule } from '@apps/manager/manager.module';
import { appConfig } from './app.config';
import { RegistryProcessorModule } from '@apps/registry-processor/registry-processor.module';
import { RepositoryProcessorModule } from '@apps/repository-processor/repository-processor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
      cache: false,
    }),
    SqsModule.forRoot({ global: true }),
    LoggerModule,
    ...registerWhenAppMode([ApiModule], APP_MODE.APP_API),
    ...registerWhenAppMode([ManagerModule], APP_MODE.APP_MANAGER),
    ...registerWhenAppMode([RegistryProcessorModule], APP_MODE.APP_REGISTRY_PROCESSOR),
    ...registerWhenAppMode([RepositoryProcessorModule], APP_MODE.APP_REPOSITORY_PROCESSOR),
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
