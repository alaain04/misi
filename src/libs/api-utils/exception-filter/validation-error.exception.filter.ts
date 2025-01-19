import { ValidationError } from '@libs/errors';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from './error-response.type';

@Catch(ValidationError)
export class ValidationExceptionFilter implements ExceptionFilter {
  protected intoErrorResponse(exception: ValidationError): ErrorResponse {
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: exception.message,
      error: 'Bad Request',
      details: exception.getFailedConstraints(),
    };
  }

  catch(exception: ValidationError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const errorResponse = this.intoErrorResponse(exception);

    res.status(errorResponse.statusCode).json(errorResponse);
  }
}
