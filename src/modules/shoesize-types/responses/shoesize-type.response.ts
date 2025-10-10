import { ApiProperty } from '@nestjs/swagger';

export class ShoesizeTypeResponse {
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

	@ApiProperty({ description: 'UK shoe size' })
	uk_size!: string;

	@ApiProperty({ description: 'US shoe size' })
	us_size!: string;

	@ApiProperty({ description: 'EU shoe size' })
	eu_size!: string;

	@ApiProperty({ 
		enum: ['shoe_men', 'shoe_women', 'shoe_children'],
		description: 'Shoe category for the size'
	})
	shoe_category!: 'shoe_men' | 'shoe_women' | 'shoe_children';

	@ApiProperty()
	created_at!: Date;

	@ApiProperty()
	updated_at!: Date;

	@ApiProperty({ required: false, nullable: true })
	deleted_at?: Date | null;
}