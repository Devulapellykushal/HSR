import { ApiProperty } from '@nestjs/swagger';
import { BloodGroupTypeResponse } from 'src/modules/bloodgroup-types/responses/bloodgroup-type.response';
import { ClothingSizeTypeResponse } from 'src/modules/clothingsize-types/responses/clothingsize-type.response';
import { ShoesizeTypeResponse } from 'src/modules/shoesize-types/responses/shoesize-type.response';
import { RelationTypeResponse } from 'src/modules/relation-types/responses/relation-type.response';

export class DropdownResponse {
	@ApiProperty({ type: [BloodGroupTypeResponse], example: [] })
	blood_groups!: BloodGroupTypeResponse[];

	@ApiProperty({ type: [ClothingSizeTypeResponse], example: [] })
	clothing_sizes!: ClothingSizeTypeResponse[];

	@ApiProperty({ type: [ShoesizeTypeResponse], example: [] })
	shoe_sizes!: ShoesizeTypeResponse[];

	@ApiProperty({ type: [RelationTypeResponse], example: [] })
	relation_types!: RelationTypeResponse[];
}
