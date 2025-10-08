import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTypesService } from './document-types.service';
import { DocumentTypesController } from './document-types.controller';
import { DocumentType } from './document-type.entity';

@Module({
	imports: [TypeOrmModule.forFeature([DocumentType])],
	controllers: [DocumentTypesController],
	providers: [DocumentTypesService],
	exports: [DocumentTypesService],
})
export class DocumentTypesModule {}
