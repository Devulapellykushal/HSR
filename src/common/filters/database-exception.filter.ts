import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    // Log the full error for debugging
    console.error('Database Error:', exception);
    
    // Handle specific database errors
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error occurred';
    
    if (exception.message.includes('duplicate key')) {
      status = HttpStatus.CONFLICT;
      message = 'Resource already exists';
    } else if (exception.message.includes('foreign key')) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid reference to related resource';
    } else if (exception.message.includes('not null')) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Required field is missing';
    }
    
    response.status(status).json({
      statusCode: status,
      message,
      error: 'Database Error',
      timestamp: new Date().toISOString(),
    });
  }
}
