import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateShoesizeTypeDto {
	@ApiProperty({ example: 'Size 42' })
	@IsString()
	@MaxLength(100)
	@IsNotEmpty()
	name!: string;

	@ApiProperty({ example: 'European shoe size 42', required: false })
	@IsString()
	@IsOptional()
	description?: string;

	@ApiProperty({ example: true, required: false, default: true })
	@IsBoolean()
	@IsOptional()
	is_active?: boolean = true;

	@ApiProperty({ example: true, required: false, default: false })
	@IsBoolean()
	@IsOptional()
	is_predefined?: boolean = false;

	@ApiProperty({ example: '42', description: 'UK shoe size' })
	@IsString()
	@MaxLength(50)
	@IsNotEmpty()
	uk_size!: string;

	@ApiProperty({ example: '43', description: 'US shoe size' })
	@IsString()
	@MaxLength(50)
	@IsNotEmpty()
	us_size!: string;

	@ApiProperty({ example: '42', description: 'EU shoe size' })
	@IsString()
	@MaxLength(50)
	@IsNotEmpty()
	eu_size!: string;

	@ApiProperty({ 
		example: 'shoe_men',
		enum: ['shoe_men', 'shoe_women', 'shoe_children'],
		description: 'Shoe category for the size'
	})
	@IsEnum(['shoe_men', 'shoe_women', 'shoe_children'])
	@IsNotEmpty()
	shoe_category!: 'shoe_men' | 'shoe_women' | 'shoe_children';
}