import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  // standardized success and error responses
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  // Swagger configuration using environment variables
  const config = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_TITLE ?? 'API')
    .setDescription(
      process.env.SWAGGER_DESCRIPTION ?? 'API documentation',
    )
    .setVersion(process.env.SWAGGER_VERSION ?? '1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const swaggerPath = process.env.SWAGGER_PATH ?? 'api';
  SwaggerModule.setup(swaggerPath, app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
