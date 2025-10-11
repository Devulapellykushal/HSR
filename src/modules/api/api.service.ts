import { Injectable } from '@nestjs/common';
import { BloodGroupTypesService } from 'src/modules/bloodgroup-types/bloodgroup-types.service';
import { ClothingSizeTypesService } from 'src/modules/clothingsize-types/clothingsize-types.service';
import { ShoesizeTypesService } from 'src/modules/shoesize-types/shoesize-types.service';

@Injectable()
export class ApiService {
	constructor(
		private readonly bloodGroupTypesService: BloodGroupTypesService,
		private readonly clothingSizeTypesService: ClothingSizeTypesService,
		private readonly shoesizeTypesService: ShoesizeTypesService,
	) {}

	async getDropdown() {
		const [blood_groups, clothing_sizes, shoe_sizes] = await Promise.all([
			this.bloodGroupTypesService.getAll(),
			this.clothingSizeTypesService.getAll(),
			this.shoesizeTypesService.getAll(),
		]);
		return { blood_groups, clothing_sizes, shoe_sizes };
	}
}
