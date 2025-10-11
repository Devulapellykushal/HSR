import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentTypesModule } from 'src/modules/document-types/document-types.module';
import { BloodGroupTypesModule } from 'src/modules/bloodgroup-types/bloodgroup-types.module';
import { ClothingSizeTypesModule } from 'src/modules/clothingsize-types/clothingsize-types.module';
import { ShoesizeTypesModule } from 'src/modules/shoesize-types/shoesize-types.module';
import { RelationTypesModule } from 'src/modules/relation-types/relation-types.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { getCommonDbConfig } from 'src/config/database.config';
import { ApiModule } from 'src/modules/api/api.module';

@Module({
  imports: [
    // load .env and make config available app-wide
    ConfigModule.forRoot({ isGlobal: true }),
    // database connection using TypeORM + PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        ...getCommonDbConfig(),
        autoLoadEntities: true,
      }),
    }),
    AuthModule,
    ApiModule,
    DocumentTypesModule,
    BloodGroupTypesModule,
    ClothingSizeTypesModule,
    ShoesizeTypesModule,
    RelationTypesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

