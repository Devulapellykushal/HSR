import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min, ValidateNested } from 'class-validator';
import { FamilyMemberGender } from '../family-member-personal-detail.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMemberDto {
	@ApiPropertyOptional({ example: 'John' })
	@IsOptional()
	@IsString()
	first_name?: string | null;

	@ApiPropertyOptional({ example: 'Doe' })
	@IsOptional()
	@IsString()
	last_name?: string | null;

	@ApiProperty({ format: 'uuid', description: 'Relation type id' })
	@IsUUID()
	@IsNotEmpty()
	relation_type_id!: string;
}

export class CreatePersonalDetailDto {
	@ApiPropertyOptional({ format: 'date', example: '1990-01-01' })
	@IsOptional()
	@IsDateString()
	dob?: string | null;

	@ApiPropertyOptional({ enum: FamilyMemberGender })
	@IsOptional()
	@IsEnum(FamilyMemberGender)
	gender?: FamilyMemberGender | null;

	@ApiPropertyOptional({ minimum: 30, maximum: 300, example: 175 })
	@IsOptional()
	@IsInt()
	@Min(30)
	@Max(300)
	height?: number | null;

	@ApiPropertyOptional({ minimum: 1, maximum: 1000, example: 70 })
	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(1000)
	weight?: number | null;

	@ApiPropertyOptional({ format: 'uuid' })
	@IsOptional()
	@IsUUID()
	blood_group_id?: string | null;

	@ApiPropertyOptional({ format: 'uuid' })
	@IsOptional()
	@IsUUID()
	upper_clothing_size_id?: string | null;

	@ApiPropertyOptional({ format: 'uuid' })
	@IsOptional()
	@IsUUID()
	lower_clothing_size_id?: string | null;

	@ApiPropertyOptional({ format: 'uuid' })
	@IsOptional()
	@IsUUID()
	shoes_size_id?: string | null;
}

export class CreateHealthDetailDto {
	@ApiPropertyOptional({ format: 'date', example: '2025-10-10' })
	@IsOptional()
	@IsDateString()
	health_date?: string | null;

	@ApiPropertyOptional({ minimum: 50, maximum: 300, example: 120 })
	@IsOptional()
	@IsInt()
	@Min(50)
	@Max(300)
	blood_pressure_systolic?: number | null;

	@ApiPropertyOptional({ minimum: 30, maximum: 200, example: 80 })
	@IsOptional()
	@IsInt()
	@Min(30)
	@Max(200)
	blood_pressure_diastolic?: number | null;

	@ApiPropertyOptional({ minimum: 30, maximum: 300, example: 72 })
	@IsOptional()
	@IsInt()
	@Min(30)
	@Max(300)
	heart_rate?: number | null;

	@ApiPropertyOptional({ type: 'string', example: '36.8', description: 'decimal(4,1)' })
	@IsOptional()
	@IsString()
	temperature?: string | null; // decimal(4,1)

	@ApiPropertyOptional({ type: 'string', example: '95.50', description: 'decimal(6,2)' })
	@IsOptional()
	@IsString()
	blood_sugar?: string | null; // decimal(6,2)

	@ApiPropertyOptional({ type: 'string', example: '180.00', description: 'decimal(6,2)' })
	@IsOptional()
	@IsString()
	cholesterol?: string | null; // decimal(6,2)

	@ApiPropertyOptional({ example: 'Headache' })
	@IsOptional()
	@IsString()
	symptoms?: string | null;

	@ApiPropertyOptional({ example: 'Paracetamol' })
	@IsOptional()
	@IsString()
	medications?: string | null;

	@ApiPropertyOptional({ example: 'None' })
	@IsOptional()
	@IsString()
	allergies?: string | null;

	@ApiPropertyOptional({ example: 'Hypertension' })
	@IsOptional()
	@IsString()
	medical_conditions?: string | null;

	@ApiPropertyOptional({ example: 'Follow up in 2 weeks' })
	@IsOptional()
	@IsString()
	notes?: string | null;
}

export class CreateFamilyMemberRequestDto {
	@ApiProperty({ type: CreateMemberDto })
	@ValidateNested()
	@Type(() => CreateMemberDto)
	member!: CreateMemberDto;

	@ApiPropertyOptional({ type: [CreatePersonalDetailDto] })
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreatePersonalDetailDto)
	personal_details?: CreatePersonalDetailDto[];

	@ApiPropertyOptional({ type: [CreateHealthDetailDto] })
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateHealthDetailDto)
	health_details?: CreateHealthDetailDto[];
}
