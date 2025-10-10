import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';

export class QueryClothingSizeTypeDto {
	@ApiPropertyOptional({ example: 1, minimum: 1, default: 1 })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page?: number = 1;

	@ApiPropertyOptional({ example: 10, minimum: 1, maximum: 100, default: 10 })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@IsPositive()
	@Max(100)
	limit?: number = 10;

	@ApiPropertyOptional({ example: '', description: 'Search text for name/description' })
	@IsOptional()
	@IsString()
	@Transform(({ value }) => String(value).trim())
	search?: string;

	@ApiPropertyOptional({ 
		example: 'shirt_men',
		enum: ['pant_men', 'shirt_men', 'pant_women', 'shirt_women', 'dress_women', 'pant_boy', 'shirt_boy', 'pant_girl', 'shirt_girl', 'frock_girl'],
		description: 'Filter by clothing category'
	})
	@IsOptional()
	@IsEnum(['pant_men', 'shirt_men', 'pant_women', 'shirt_women', 'dress_women', 'pant_boy', 'shirt_boy', 'pant_girl', 'shirt_girl', 'frock_girl'])
	cloth_category?: 'pant_men' | 'shirt_men' | 'pant_women' | 'shirt_women' | 'dress_women' | 'pant_boy' | 'shirt_boy' | 'pant_girl' | 'shirt_girl' | 'frock_girl';

	@ApiPropertyOptional({ example: 'created_at', enum: ['name', 'created_at', 'cloth_category'] })
	@IsOptional()
	@IsString()
	@Transform(({ value }) => String(value).toLowerCase())
	@IsIn(['name', 'created_at', 'cloth_category'])
	sort_by?: string = 'created_at';

	@ApiPropertyOptional({ example: 'DESC', enum: ['ASC', 'DESC'], default: 'DESC' })
	@IsOptional()
	@IsString()
	@Transform(({ value }) => String(value).toUpperCase())
	@IsIn(['ASC', 'DESC', 'asc', 'desc'])
	sort_order?: string = 'DESC';
	
}