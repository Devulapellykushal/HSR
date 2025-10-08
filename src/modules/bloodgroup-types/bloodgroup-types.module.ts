import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BloodGroupTypesService } from './bloodgroup-types.service';
import { BloodGroupTypesController } from './bloodgroup-types.controller';
import { BloodGroupType } from './bloodgroup-type.entity';

@Module({
	imports: [TypeOrmModule.forFeature([BloodGroupType])],
	controllers: [BloodGroupTypesController],
	providers: [BloodGroupTypesService],
	exports: [BloodGroupTypesService],
})
export class BloodGroupTypesModule {}