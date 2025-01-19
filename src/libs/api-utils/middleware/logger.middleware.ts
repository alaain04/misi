import { Injectable, NestMiddleware } from '@nestjs/common';
import { WinstonLoggerService } from '@shared/logger';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: WinstonLoggerService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length') ?? '';
      this.loggerService.http(
        `${method} ${originalUrl} ${statusCode} ${contentLength} `,
      );
    });

    next();
  }
}
