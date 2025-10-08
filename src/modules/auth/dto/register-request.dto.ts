import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class RegisterRequestDto {
	@ApiProperty({ required: false, example: 'user@example.com' })
	@IsOptional()
	@IsString()
	email?: string;

	@ApiProperty({ required: false, example: '9999999999' })
	@IsOptional()
	@IsString()
	mobile?: string;

	@ApiProperty({ example: 'user@123' })
	@IsString()
	@IsNotEmpty()
	password!: string;

	@ApiProperty({ required: false, example: 'John' })
	@IsOptional()
	@IsString()
	first_name?: string;

	@ApiProperty({ required: false, example: 'Doe' })
	@IsOptional()
	@IsString()
	last_name?: string;
}
