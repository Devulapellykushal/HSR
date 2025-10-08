import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClothingSizeTypesService } from './clothingsize-types.service';
import { ClothingSizeTypesController } from './clothingsize-types.controller';
import { ClothingSizeType } from './clothingsize-type.entity';

@Module({
	imports: [TypeOrmModule.forFeature([ClothingSizeType])],
	controllers: [ClothingSizeTypesController],
	providers: [ClothingSizeTypesService],
	exports: [ClothingSizeTypesService],
})
export class ClothingSizeTypesModule {}