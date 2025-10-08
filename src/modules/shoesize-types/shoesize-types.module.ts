import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoesizeTypesService } from './shoesize-types.service';
import { ShoesizeTypesController } from './shoesize-types.controller';
import { ShoesizeType } from './shoesize-type.entity';

@Module({
	imports: [TypeOrmModule.forFeature([ShoesizeType])],
	controllers: [ShoesizeTypesController],
	providers: [ShoesizeTypesService],
	exports: [ShoesizeTypesService],
})
export class ShoesizeTypesModule {}