import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiCode } from './constants/apiCode';

export class APIException extends HttpException {
  code: string | number;
  message: string;
  details: any;

  constructor(
    code: string | number,
    status: HttpStatus,
    message: string,
    details?: any,
  ) {
    const exceptionResponse = {
      code,
      message,
      details,
    };
    super(exceptionResponse, status);
    this.code = code;
    this.message = message;
    this.details = details;
  }

  toObj(): object {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }

  toJSON(): string {
    return JSON.stringify(this.toObj());
  }
}

export class ValidationException extends APIException {
  constructor(code?: string | number, message?: string, details?: any) {
    if (!code) code = ApiCode[400].VALIDATION_ERROR.code;
    if (!message) message = ApiCode[400].VALIDATION_ERROR.description;
    super(code, HttpStatus.BAD_REQUEST, message, details);
  }
}

export class ExternalAPIException extends APIException {
  constructor(
    message = ApiCode[424].EXTERNAL_API_ERROR.description,
    details?: any,
  ) {
    super(
      ApiCode[424].EXTERNAL_API_ERROR.code,
      HttpStatus.FAILED_DEPENDENCY,
      message,
      details,
    );
  }
}

const nestLogger = new Logger('HandleError');

// Error handler
@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): Response<unknown> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof APIException) {
      nestLogger.warn(exception.toJSON());
      return response.status(exception.getStatus()).json(exception.toObj());
    }

    if (exception instanceof HttpException) {
      nestLogger.error(
        (exception as any)?.stack || (exception as any)?.message,
      );
      return response
        .status(exception.getStatus())
        .json(
          new APIException(
            ApiCode[500].UNHANDLED_ERROR.code,
            exception.getStatus(),
            (exception.getResponse() as any)?.message ||
              ApiCode[500].UNHANDLED_ERROR.description,
          ).toObj(),
        );
    }

    nestLogger.error((exception as any)?.stack || (exception as any)?.message);
    return response
      .status(500)
      .json(
        new APIException(
          ApiCode[500].UNKNOWN_ERROR.code,
          500,
          ApiCode[500].UNKNOWN_ERROR.description,
          JSON.stringify(exception),
        ).toObj(),
      );
  }
}
