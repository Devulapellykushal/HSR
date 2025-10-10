import { ApiProperty } from '@nestjs/swagger';

export class CreateFamilyMemberResponse {
	@ApiProperty({ format: 'uuid' })
	member_id!: string;

	@ApiProperty({ example: 0 })
	personal_details_created!: number;

	@ApiProperty({ example: 0 })
	health_details_created!: number;
}
