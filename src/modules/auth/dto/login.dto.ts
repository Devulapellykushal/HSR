import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
	@IsString()
	@IsNotEmpty()
	identifier!: string; // email or mobile

	@IsString()
	@IsNotEmpty()
	password!: string;
}
