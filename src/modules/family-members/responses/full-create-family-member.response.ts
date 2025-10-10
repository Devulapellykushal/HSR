import { ApiProperty } from '@nestjs/swagger';

export class IdNameMini {
	@ApiProperty({ format: 'uuid' })
	id!: string;
	@ApiProperty()
	name!: string;
}

export class FamilyMemberEntityResponse {
	@ApiProperty({ format: 'uuid' })
	id!: string;
	@ApiProperty({ format: 'uuid' })
	created_by!: string;
	@ApiProperty({ format: 'uuid' })
	relation_type_id!: string;
	@ApiProperty({ nullable: true })
	first_name!: string | null;
	@ApiProperty({ nullable: true })
	last_name!: string | null;
	@ApiProperty()
	is_family_head!: boolean;
	@ApiProperty({ type: 'string', format: 'date-time' })
	created_at!: Date;
	@ApiProperty({ type: 'string', format: 'date-time' })
	updated_at!: Date;
	@ApiProperty({ type: 'string', format: 'date-time', nullable: true })
	deleted_at!: Date | null;

	@ApiProperty({ type: IdNameMini, nullable: true, description: 'Joined relation type' })
	relation_type!: IdNameMini | null;
}

export class FamilyMemberPersonalDetailEntityResponse {
	@ApiProperty({ format: 'uuid' })
	id!: string;
	@ApiProperty({ format: 'uuid' })
	family_member_id!: string;
	@ApiProperty({ type: 'string', format: 'date', nullable: true })
	dob!: string | null;
	@ApiProperty({ enum: ['Male', 'Female', 'Other'], nullable: true })
	gender!: 'Male' | 'Female' | 'Other' | null;
	@ApiProperty({ nullable: true })
	height!: number | null;
	@ApiProperty({ nullable: true })
	weight!: number | null;
	@ApiProperty({ format: 'uuid', nullable: true })
	blood_group_id!: string | null;
	@ApiProperty({ format: 'uuid', nullable: true })
	upper_clothing_size_id!: string | null;
	@ApiProperty({ format: 'uuid', nullable: true })
	lower_clothing_size_id!: string | null;
	@ApiProperty({ format: 'uuid', nullable: true })
	shoes_size_id!: string | null;
	@ApiProperty({ type: 'string', format: 'date-time' })
	created_at!: Date;
	@ApiProperty({ type: 'string', format: 'date-time' })
	updated_at!: Date;
	@ApiProperty({ type: 'string', format: 'date-time', nullable: true })
	deleted_at!: Date | null;

	@ApiProperty({ type: IdNameMini, nullable: true })
	blood_group!: IdNameMini | null;
	@ApiProperty({ type: IdNameMini, nullable: true })
	upper_clothing_size!: IdNameMini | null;
	@ApiProperty({ type: IdNameMini, nullable: true })
	lower_clothing_size!: IdNameMini | null;
	@ApiProperty({ type: IdNameMini, nullable: true })
	shoes_size!: IdNameMini | null;
}

export class FamilyMemberHealthDetailEntityResponse {
	@ApiProperty({ format: 'uuid' })
	id!: string;
	@ApiProperty({ format: 'uuid' })
	family_member_id!: string;
	@ApiProperty({ type: 'string', format: 'date' })
	health_date!: string;
	@ApiProperty({ nullable: true })
	blood_pressure_systolic!: number | null;
	@ApiProperty({ nullable: true })
	blood_pressure_diastolic!: number | null;
	@ApiProperty({ nullable: true })
	heart_rate!: number | null;
	@ApiProperty({ type: 'string', nullable: true, description: 'decimal(4,1)' })
	temperature!: string | null;
	@ApiProperty({ type: 'string', nullable: true, description: 'decimal(6,2)' })
	blood_sugar!: string | null;
	@ApiProperty({ type: 'string', nullable: true, description: 'decimal(6,2)' })
	cholesterol!: string | null;
	@ApiProperty({ nullable: true })
	symptoms!: string | null;
	@ApiProperty({ nullable: true })
	medications!: string | null;
	@ApiProperty({ nullable: true })
	allergies!: string | null;
	@ApiProperty({ nullable: true })
	medical_conditions!: string | null;
	@ApiProperty({ nullable: true })
	notes!: string | null;
	@ApiProperty({ type: 'string', format: 'date-time' })
	created_at!: Date;
	@ApiProperty({ type: 'string', format: 'date-time' })
	updated_at!: Date;
	@ApiProperty({ type: 'string', format: 'date-time', nullable: true })
	deleted_at!: Date | null;
}

export class FullCreateFamilyMemberResponse {
	@ApiProperty({ type: FamilyMemberEntityResponse })
	member!: FamilyMemberEntityResponse;
	@ApiProperty({ type: FamilyMemberPersonalDetailEntityResponse, nullable: true })
	personal_detail!: FamilyMemberPersonalDetailEntityResponse | null;
	@ApiProperty({ type: FamilyMemberHealthDetailEntityResponse, nullable: true })
	health_detail!: FamilyMemberHealthDetailEntityResponse | null;
}
