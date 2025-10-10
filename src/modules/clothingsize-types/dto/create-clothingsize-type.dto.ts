import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateClothingSizeTypeDto {
	@ApiProperty({ example: 'M' })
	@IsString()
	@MaxLength(255)
	@IsNotEmpty()
	name!: string;

	@ApiProperty({ example: 'Medium size', required: false })
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

	@ApiProperty({ 
		example: 'shirt_men',
		enum: ['pant_men', 'shirt_men', 'pant_women', 'shirt_women', 'dress_women', 'pant_boy', 'shirt_boy', 'pant_girl', 'shirt_girl', 'frock_girl'],
		description: 'Clothing category for the size'
	})
	@IsEnum(['pant_men', 'shirt_men', 'pant_women', 'shirt_women', 'dress_women', 'pant_boy', 'shirt_boy', 'pant_girl', 'shirt_girl', 'frock_girl'])
	@IsNotEmpty()
	cloth_category!: 'pant_men' | 'shirt_men' | 'pant_women' | 'shirt_women' | 'dress_women' | 'pant_boy' | 'shirt_boy' | 'pant_girl' | 'shirt_girl' | 'frock_girl';
}