import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRelationTypeDto {
	@ApiProperty({ example: 'Father' })
	@IsString()
	@MaxLength(255)
	@IsNotEmpty()
	name!: string;

	@ApiProperty({ example: 'Father relation', required: false })
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
}