/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { LoggerService } from '@nestjs/common';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import { createLogger } from 'winston';

type NpmLogLevel =
  | 'error'
  | 'warn'
  | 'info'
  | 'http'
  | 'verbose'
  | 'debug'
  | 'silly';

export class WinstonLoggerService implements LoggerService {
  private readonly loggerOverrides = new Map<string, winston.Logger>();
  private readonly httpLogger?: winston.Logger;
  private readonly defaultLogger: winston.Logger;

  constructor(cfg: {
    logLevelOverrides: Record<string, string>;
    httpLogs: boolean;
    logLevel: string;
  }) {
    const npmLogLevel = this.mapLogLevel(cfg.logLevel);
    this.defaultLogger = this.createLogger(npmLogLevel);

    if (cfg.httpLogs) {
      this.httpLogger = this.createLogger('http');
    }

    Object.entries(cfg.logLevelOverrides).forEach(([context, level]) => {
      const npmLogLevel = this.mapLogLevel(level);
      this.loggerOverrides.set(context, this.createLogger(npmLogLevel));
    });
  }

  public debug(message: any, ...optionalParams: any[]): any {
    const { context, meta } = this.extractParams(optionalParams);
    return this.getLogger(context).debug(message, { context, ...meta });
  }

  public log(message: any, ...optionalParams: any[]): any {
    const { context, meta } = this.extractParams(optionalParams);
    return this.getLogger(context).info(message, { context, ...meta });
  }

  public warn(message: any, ...optionalParams: any[]): any {
    const { context, meta } = this.extractParams(optionalParams);
    return this.getLogger(context).warn(message, { context, ...meta });
  }

  public error(message: any, trace?: string, context?: string): any {
    const logger = this.getLogger(context);

    if (message instanceof Error) {
      const { message: msg, ...meta } = message;

      logger.error(msg, { context, ...meta });

      if (!logger.silent) {
        console.error(message);
      }

      return;
    }

    logger.error(message, { context });

    if (trace && !logger.silent) {
      console.error(`${trace}\n`);
    }
  }

  public fatal(message: any, trace?: string, context?: string): any {
    this.error(message, trace, context);
  }

  public http(message: string): void {
    this.httpLogger?.http(message);
  }

  private getLogger(context?: string): winston.Logger {
    if (context) {
      return this.loggerOverrides.get(context) ?? this.defaultLogger;
    }

    return this.defaultLogger;
  }

  private mapLogLevel(level: string): NpmLogLevel {
    if (level === 'log') {
      return 'info';
    }

    if (level === 'fatal') {
      return 'error';
    }

    return level as NpmLogLevel;
  }

  private extractParams(params: any[]): { context?: string; meta?: any } {
    const context = params.at(-1);
    const meta = params.length > 1 ? params.at(0) : {};

    return { context, meta };
  }

  private createLogger(level: NpmLogLevel): winston.Logger {
    return createLogger({
      levels: winston.config.npm.levels,
      level,
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('Nest', {
              colors: true,
              prettyPrint: true,
              processId: true,
              appName: true,
            }),
          ),
        }),
      ],
    });
  }
}
