import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class LoginRequestDto {
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
}
