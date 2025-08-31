import { Global, Module } from '@nestjs/common';
import { WinstonLoggerService } from './winston-logger.service';

export const LOGGER = new WinstonLoggerService({
  logLevel: 'error',
  httpLogs: true,
  logLevelOverrides: {},
});

@Global()
@Module({
  providers: [
    {
      provide: WinstonLoggerService,
      useValue: LOGGER,
    },
  ],
  exports: [WinstonLoggerService],
})
export class LoggerModule { }
