import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const request = ctx.getRequest();

		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message: string | string[] = 'Internal server error';

		if (exception instanceof HttpException) {
			status = exception.getStatus();
			const res = exception.getResponse();
			message =
				typeof res === 'string'
					? res
					: (res as any)?.message || exception.message || 'Error';
		}

		// Ensure message is a string (not an array)
		const messageStr = Array.isArray(message)
			? message.join(', ')
			: message;

		response.status(status).json({
			status_code: status,
			status: false,
			message: messageStr,
			data: [],
			path: request?.url,
		});
	}
}
