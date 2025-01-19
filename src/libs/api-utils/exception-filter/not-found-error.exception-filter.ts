import { NotFoundError, ValidationError } from '@libs/errors';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from './error-response.type';

@Catch(NotFoundError)
export class NotFoundExceptionFilter implements ExceptionFilter {
  protected intoErrorResponse(exception: NotFoundError): ErrorResponse {
    return {
      statusCode: HttpStatus.NOT_FOUND,
      message: exception.message,
      error: 'Not Found',
    };
  }

  catch(exception: ValidationError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const errorResponse = this.intoErrorResponse(exception);

    res.status(errorResponse.statusCode).json(errorResponse);
  }
}
