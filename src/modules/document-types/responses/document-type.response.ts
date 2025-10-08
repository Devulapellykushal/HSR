import { ApiProperty } from '@nestjs/swagger';

export class DocumentTypeResponse {
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

	@ApiProperty()
	created_at!: Date;

	@ApiProperty()
	updated_at!: Date;

	@ApiProperty({ required: false, nullable: true })
	deleted_at?: Date | null;
}
