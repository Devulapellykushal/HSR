import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			map((data) => {
				const res = context.switchToHttp().getResponse();
				const status_code = res?.statusCode ?? 200;
				return {
					status_code,
					status: true,
					message: 'Success',
					data: data ?? null,
				};
			}),
		);
	}
}
