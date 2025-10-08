import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentTypesModule } from 'src/modules/document-types/document-types.module';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [
    // load .env and make config available app-wide
    ConfigModule.forRoot({ isGlobal: true }),
    // database connection using TypeORM + PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        autoLoadEntities: true,
        // OK for local/dev; disable in production
        synchronize: process.env.NODE_ENV !== 'production',
      }),
    }),
    AuthModule,
    DocumentTypesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
