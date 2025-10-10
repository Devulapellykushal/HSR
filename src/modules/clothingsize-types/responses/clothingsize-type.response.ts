import { ApiProperty } from '@nestjs/swagger';

export class ClothingSizeTypeResponse {
	@ApiProperty()
	id!: string;

	@ApiProperty()
	name!: string;

	@ApiProperty({ required: false, nullable: true })
	description?: string | null;

	@ApiProperty({ default: true })
	is_active!: boolean;

	@ApiProperty({ default: false })
	is_predefined!: boolean;

	@ApiProperty({ 
		enum: ['pant_men', 'shirt_men', 'pant_women', 'shirt_women', 'dress_women', 'pant_boy', 'shirt_boy', 'pant_girl', 'shirt_girl', 'frock_girl'],
		description: 'Clothing category for the size'
	})
	cloth_category!: 'pant_men' | 'shirt_men' | 'pant_women' | 'shirt_women' | 'dress_women' | 'pant_boy' | 'shirt_boy' | 'pant_girl' | 'shirt_girl' | 'frock_girl';

	@ApiProperty()
	created_at!: Date;

	@ApiProperty()
	updated_at!: Date;

	@ApiProperty({ required: false, nullable: true })
	deleted_at?: Date | null;
}