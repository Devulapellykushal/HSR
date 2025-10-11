import { Injectable } from '@nestjs/common';
import { BloodGroupTypesService } from 'src/modules/bloodgroup-types/bloodgroup-types.service';
import { ClothingSizeTypesService } from 'src/modules/clothingsize-types/clothingsize-types.service';
import { ShoesizeTypesService } from 'src/modules/shoesize-types/shoesize-types.service';
import { RelationTypesService } from 'src/modules/relation-types/relation-types.service';

@Injectable()
export class ApiService {
	constructor(
		private readonly bloodGroupTypesService: BloodGroupTypesService,
		private readonly clothingSizeTypesService: ClothingSizeTypesService,
		private readonly shoesizeTypesService: ShoesizeTypesService,
		private readonly relationTypesService: RelationTypesService,
	) {}

	async getDropdown() {
		const [blood_groups, clothing_sizes, shoe_sizes, relation_types] = await Promise.all([
			this.bloodGroupTypesService.getAll(),
			this.clothingSizeTypesService.getAll(),
			this.shoesizeTypesService.getAll(),
			this.relationTypesService.getAll(),
		]);
		return { blood_groups, clothing_sizes, shoe_sizes, relation_types };
	}
}
