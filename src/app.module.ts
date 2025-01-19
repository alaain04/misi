import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@shared/logger';
import { ApiModule } from '@apps/api/api.module';
import {
  APP_MODE,
  LoggerMiddleware,
  registerWhenAppMode,
} from '@libs/api-utils';
import { validate } from './app.config';
import { PrismaModule } from '@shared/database/prisma.module';
import { SqsModule } from '@shared/aws/sqs';
import { ManagerModule } from '@apps/manager/manager.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
    }),
    SqsModule.forRoot({ global: true }),
    LoggerModule,
    ...registerWhenAppMode([ApiModule], APP_MODE.APP_API),
    ...registerWhenAppMode([ManagerModule], APP_MODE.APP_MANAGER),
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
