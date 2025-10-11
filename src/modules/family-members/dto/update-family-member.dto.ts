import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min, ValidateNested } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { FamilyMemberGender } from '../family-member-personal-detail.entity';

export class UpdateMemberDto {
	@ApiPropertyOptional({ example: 'Jane' })
	@IsOptional()
	@IsString()
	first_name?: string | null;

	@ApiPropertyOptional({ example: 'Doe' })
	@IsOptional()
	@IsString()
	last_name?: string | null;

	@ApiPropertyOptional({ format: 'uuid', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
	@IsOptional()
	@IsUUID()
	relation_type_id?: string;
}

export class UpdatePersonalDetailDto {
	@ApiPropertyOptional({ format: 'date', example: '1992-02-02' })
	@IsOptional()
	@IsDateString()
	dob?: string | null;

	@ApiPropertyOptional({ enum: FamilyMemberGender, example: 'Female' })
	@IsOptional()
	@IsEnum(FamilyMemberGender)
	gender?: FamilyMemberGender | null;

	@ApiPropertyOptional({ minimum: 30, maximum: 300, example: 165 })
	@IsOptional()
	@IsInt()
	@Min(30)
	@Max(300)
	height?: number | null;

	@ApiPropertyOptional({ minimum: 1, maximum: 1000, example: 55 })
	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(1000)
	weight?: number | null;

	@ApiPropertyOptional({ format: 'uuid', example: '11111111-1111-1111-1111-111111111111' })
	@IsOptional()
	@IsUUID()
	blood_group_id?: string | null;

	@ApiPropertyOptional({ format: 'uuid', example: '22222222-2222-2222-2222-222222222222' })
	@IsOptional()
	@IsUUID()
	upper_clothing_size_id?: string | null;

	@ApiPropertyOptional({ format: 'uuid', example: '33333333-3333-3333-3333-333333333333' })
	@IsOptional()
	@IsUUID()
	lower_clothing_size_id?: string | null;

	@ApiPropertyOptional({ format: 'uuid', example: '33333333-3333-3333-3333-333333333333' })
	@IsOptional()
	@IsUUID()
	dress_clothing_size_id?: string | null;

	@ApiPropertyOptional({ format: 'uuid', example: '44444444-4444-4444-4444-444444444444' })
	@IsOptional()
	@IsUUID()
	shoes_size_id?: string | null;
}

export class UpdateHealthDetailDto {
	@ApiPropertyOptional({ format: 'date', example: '2025-10-10' })
	@IsOptional()
	@IsDateString()
	health_date?: string | null;

	@ApiPropertyOptional({ minimum: 50, maximum: 300, example: 118 })
	@IsOptional()
	@IsInt()
	@Min(50)
	@Max(300)
	blood_pressure_systolic?: number | null;

	@ApiPropertyOptional({ minimum: 30, maximum: 200, example: 78 })
	@IsOptional()
	@IsInt()
	@Min(30)
	@Max(200)
	blood_pressure_diastolic?: number | null;

	@ApiPropertyOptional({ minimum: 30, maximum: 300, example: 70 })
	@IsOptional()
	@IsInt()
	@Min(30)
	@Max(300)
	heart_rate?: number | null;

	@ApiPropertyOptional({ type: 'string', description: 'decimal(4,1)', example: '36.7' })
	@IsOptional()
	@IsString()
	temperature?: string | null;

	@ApiPropertyOptional({ type: 'string', description: 'decimal(6,2)', example: '90.00' })
	@IsOptional()
	@IsString()
	blood_sugar?: string | null;

	@ApiPropertyOptional({ type: 'string', description: 'decimal(6,2)', example: '175.00' })
	@IsOptional()
	@IsString()
	cholesterol?: string | null;

	@ApiPropertyOptional({ example: 'None' })
	@IsOptional()
	@IsString()
	symptoms?: string | null;

	@ApiPropertyOptional({ example: 'Vitamin D' })
	@IsOptional()
	@IsString()
	medications?: string | null;

	@ApiPropertyOptional({ example: 'Peanuts' })
	@IsOptional()
	@IsString()
	allergies?: string | null;

	@ApiPropertyOptional({ example: 'Asthma' })
	@IsOptional()
	@IsString()
	medical_conditions?: string | null;

	@ApiPropertyOptional({ example: 'Updated' })
	@IsOptional()
	@IsString()
	notes?: string | null;
}

export class UpdateFamilyMemberRequestDto {
	@ApiPropertyOptional({ type: UpdateMemberDto })
	@IsOptional()
	@ValidateNested()
	@Type(() => UpdateMemberDto)
	member?: UpdateMemberDto;

	@ApiPropertyOptional({ type: UpdatePersonalDetailDto })
	@IsOptional()
	@ValidateNested()
	@Type(() => UpdatePersonalDetailDto)
	personal_detail?: UpdatePersonalDetailDto;

	@ApiPropertyOptional({ type: UpdateHealthDetailDto })
	@IsOptional()
	@ValidateNested()
	@Type(() => UpdateHealthDetailDto)
	health_detail?: UpdateHealthDetailDto;
}
