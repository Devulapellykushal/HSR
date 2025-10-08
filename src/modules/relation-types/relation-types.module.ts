import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelationTypesService } from './relation-types.service';
import { RelationTypesController } from './relation-types.controller';
import { RelationType } from './relation-type.entity';

@Module({
	imports: [TypeOrmModule.forFeature([RelationType])],
	controllers: [RelationTypesController],
	providers: [RelationTypesService],
	exports: [RelationTypesService],
})
export class RelationTypesModule {}