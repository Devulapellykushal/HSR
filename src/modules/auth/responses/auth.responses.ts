import { ApiProperty } from '@nestjs/swagger';

export class JwtLoginResponse {
	@ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
	access_token!: string;

	@ApiProperty()
	user_id!: string;

	@ApiProperty({ nullable: true, required: false })
	email!: string | null;

	@ApiProperty()
	mobile!: string;

	@ApiProperty({ enum: ['admin', 'normal'] })
	role!: 'admin' | 'normal';

	@ApiProperty()
	is_active!: boolean;

	@ApiProperty({ nullable: true, required: false })
	first_name!: string | null;

	@ApiProperty({ nullable: true, required: false })
	last_name!: string | null;
}

export class MeResponse {
	@ApiProperty()
	user_id!: string;

	@ApiProperty({ nullable: true, required: false })
	email!: string | null;

	@ApiProperty()
	mobile!: string;

	@ApiProperty({ enum: ['admin', 'normal'] })
	role!: 'admin' | 'normal';

	@ApiProperty()
	is_active!: boolean;

	@ApiProperty({ nullable: true, required: false })
	first_name!: string | null;

	@ApiProperty({ nullable: true, required: false })
	last_name!: string | null;
}
