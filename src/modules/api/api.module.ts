import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { BloodGroupTypesModule } from 'src/modules/bloodgroup-types/bloodgroup-types.module';
import { ClothingSizeTypesModule } from 'src/modules/clothingsize-types/clothingsize-types.module';
import { ShoesizeTypesModule } from 'src/modules/shoesize-types/shoesize-types.module';
import { RelationTypesModule } from 'src/modules/relation-types/relation-types.module';

@Module({
	imports: [
		BloodGroupTypesModule,
		ClothingSizeTypesModule,
		ShoesizeTypesModule,
		RelationTypesModule,
	],
	controllers: [ApiController],
	providers: [ApiService],
	exports: [ApiService],
})
export class ApiModule {}
